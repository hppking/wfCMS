export function parseURL(url) {
    const a = document.createElement('a');
    a.href = url;
    const tmpHash = a.hash.replace('#/', '').split('?')
    const query = a.search || (tmpHash.length > 1 ? tmpHash[1] : '')
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: query,
        params: (function () {
            let params = {},
                seg = query.replace(/^\?/, '').split('&'),
                len = seg.length
            let p = []
            for (let i = 0; i < len; i++) {
                if (seg[i]) {
                    p = seg[i].split('=');
                    params[p[0]] = p[1];
                }
            }
            return params;
        })(),
        hash: tmpHash.length > 0 ? tmpHash[0] : '',
        path: a.pathname.replace(/^([^\/])/, '/$1')
    };
}
