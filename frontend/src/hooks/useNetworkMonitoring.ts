import { useEffect } from 'react';
import { useNetworkStore } from '../store/networkStore';

export function useNetworkMonitoring() {
    const { setOnlineStatus, updateConnectionQuality } = useNetworkStore();

    useEffect(() => {
        // 1. Basic Online/Offline Listeners
        const handleOnline = () => setOnlineStatus(true);
        const handleOffline = () => setOnlineStatus(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // 2. Advanced Connection Quality (Network Information API)
        // Note: This API is supported in Chrome/Edge/Android, but not Firefox/Safari yet.
        // We use 'any' type here because TypeScript DOM lib might not have 'connection' types by default
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

        const updateConnectionInfo = () => {
            if (connection) {
                const downlink = connection.downlink || 10; // Mb/s
                const rtt = connection.rtt || 50; // ms
                updateConnectionQuality(downlink, rtt);
            }
        };

        if (connection) {
            connection.addEventListener('change', updateConnectionInfo);
            // Initial check
            updateConnectionInfo();
        }

        // Cleanup listeners
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (connection) {
                connection.removeEventListener('change', updateConnectionInfo);
            }
        };
    }, [setOnlineStatus, updateConnectionQuality]);
}