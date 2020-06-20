export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (placeholder) {
        var random = Math.floor(Math.random() * 16);
        var value = placeholder === 'x' ? random : random & 0x3 | 0x8;
        return value.toString(16);
    });
}