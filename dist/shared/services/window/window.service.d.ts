export declare class WindowService {
    locationAssign(url: string): void;
    setLocalStorage(key: string, value: string): void;
    getLocalStorage(key: string): string;
    clearLocalStorage(): void;
    removeLocalStorage(key: string): void;
    openOnNewTab(url: string): void;
    confirm(message: string): boolean;
}
