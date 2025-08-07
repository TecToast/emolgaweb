export default function(key: string | null): string {
    const path = useRoute().params.path;
    const resolvedPath = (
        typeof path === "string" ? (path === "" ? [] : [path]) : path
    )!;
    const joined = resolvedPath.join("/");
    if(key === null) return joined;
    return joined + (resolvedPath.length ? "/" : "") + key;
}