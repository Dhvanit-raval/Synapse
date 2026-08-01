export function navigateTo(path, { replace = false } = {}) {
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentPath === path) return;

    if (replace) {
        window.history.replaceState({}, "", path);
    } else {
        window.history.pushState({}, "", path);
    }

    window.dispatchEvent(new Event("synapse:navigate"));
}
