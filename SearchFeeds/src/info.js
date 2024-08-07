// +===============================================================+
// ------------------------ BLOG INFO ----------------------------
// +===============================================================+
class BlogSearchInfo {
    // This class is entity to the information that the blogger has, like query and etc
    constructor(location = window.location) {
        this.host = location.host;
        this.hostname = location.hostname;
        this.origin = location.origin;
        this.pathname = location.pathname;
        this.label = undefined;
        this.buildLabel();
    }
    // build queries
    buildLabel(path = window.location.pathname) {
        let paths = path.split('/');
        // url / "/search/label/[label-name]"
        if (paths[1] == 'search' && paths[2] == 'label')
            this.label = paths[3];
    }
}
class BlogSearchApi {
    constructor(blog_info) {
        this.url = '';
        this.path = '';
        this.target = '/feeds/posts/default';
        this.build(blog_info);
    }
    async call(url = this.url) {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });
        return response;
    }
    build(blog_info, api_queries = '?') {
        if (blog_info instanceof BlogSearchInfo == false)
            throw Error('Blog info should be instance of BlogSearchInfo');

        // determine if there's a label search or not
        if (blog_info.label != undefined) this.path = '/-/' + blog_info.label;

        // return combine with the api_path
        this.url = blog_info.origin + this.target + this.path + api_queries;
    }
}
