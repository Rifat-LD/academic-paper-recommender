import { create } from 'zustand';

interface NetworkState {
    isOnline: boolean;
    connectionQuality: 'good' | 'poor' | 'offline';
    lastSynced: Date | null;
    downlink: number | null; // Speed in Mbps
    rtt: number | null;      // Round-trip time (latency) in ms

    // Actions
    setOnlineStatus: (status: boolean) => void;
    updateConnectionQuality: (downlink: number, rtt: number) => void;
    markSynced: () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
    // Initial state based on browser's current status
    isOnline: navigator.onLine,
    connectionQuality: navigator.onLine ? 'good' : 'offline',
    lastSynced: new Date(),
    downlink: null,
    rtt: null,

    setOnlineStatus: (status) => set((state) => ({
        isOnline: status,
        connectionQuality: status ? state.connectionQuality : 'offline'
    })),

    updateConnectionQuality: (downlink, rtt) => set(() => {
        // Logic: If latency > 500ms or speed < 1Mbps, it's "poor"
        let quality: 'good' | 'poor' | 'offline' = 'good';

        if (rtt > 500 || downlink < 1.5) {
            quality = 'poor';
        }

        return {
            connectionQuality: quality,
            downlink,
            rtt
        };
    }),

    markSynced: () => set({ lastSynced: new Date() })
}));