export interface RequireOptions {
    name: string,
    str: string
}
/**
 *
 *
 * @export
 * @param {string} contents
 * @returns
 */
export function extractRequires(contents: string): RequireOptions[] {
    let regex = new RegExp('require\\([\'"`](.*)[\'"`]\\)', "g");
    let item;
    let match = () =>
        item = regex.exec(contents);
    let data = [];
    while (match()) {
        data.push({
            name: item[1],
            str: item[0],
        });
    }
    return data;
}