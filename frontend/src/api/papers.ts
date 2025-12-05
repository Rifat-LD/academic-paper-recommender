import apiClient from './client';

// Define the shape of the API Response (matches Backend Pydantic)
interface BackendPaper {
    arxiv_id: string;
    title: string;
    abstract: string;
    authors: string[];
    published: string;
    url: string;
    categories: string[];
}

interface SearchResultItem {
    paper: BackendPaper;
    score: number;
    explanation: string;
}

interface APIResponse {
    results: SearchResultItem[];
    meta: any;
}

// Define the shape our UI expects (matches SearchPage.tsx)
export interface UIPaper {
    id: string;
    title: string;
    authors: string;
    year: number;
    abstract: string;
    relevanceScore: number;
}

export const searchService = {
    async search(query: string, limit: number = 10): Promise<UIPaper[]> {
        // 1. Make the Network Call
        const response = await apiClient.get<APIResponse>('/recommend', {
            params: { q: query, limit: limit }
        });

        // 2. Transform Data (Backend -> UI)
        return response.data.results.map((item) => {
            const paper = item.paper;

            // Extract year from "2023-10-15T..."
            const year = new Date(paper.published).getFullYear() || new Date().getFullYear();

            return {
                id: paper.arxiv_id,
                title: paper.title,
                // Join array ["A", "B"] -> string "A, B"
                authors: paper.authors.join(", "),
                year: year,
                // Highlight logic handled by CSS, we pass raw abstract here
                abstract: paper.abstract,
                // Convert 0.95 -> 95
                relevanceScore: Math.round(item.score * 100)
            };
        });
    }
};