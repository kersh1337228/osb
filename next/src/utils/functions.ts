export function formDataSerialize(
    formData: FormData
): Object {
    const obj: Record<string, any> = {};

    for (const [key, val] of formData.entries())
        obj[key] = val;

    return obj;
}

export function debounce(
    callback: (...args: any[]) => Promise<void>,
    wait: number
) {
    let timeoutId: number;
    return (...args: any[]) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(async () => {
            await callback(...args);
        }, wait);
    };
}

export function debounceSync(
    callback: (...args: any[]) => void,
    wait: number
) {
    let timeoutId: number;
    return (...args: any[]) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
}

export function ratingOrder(
    a: PostMixin,
    b: PostMixin
) {
    const aRating = a.reactions.pos.length - a.reactions.neg.length;
    const bRating = b.reactions.pos.length - b.reactions.neg.length;

    return aRating > bRating ? -1 : aRating < bRating ? 1 : 0;
}

export function timeOrder(
    a: PostMixin,
    b: PostMixin
) {
    const aTime = new Date(a.update_time);
    const bTime = new Date(b.update_time);

    return aTime > bTime ? -1 : aTime < bTime ? 1 : 0;
}
