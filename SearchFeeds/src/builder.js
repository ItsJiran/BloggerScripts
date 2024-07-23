// +===============================================================+
// --------------------- BLOG SEARCH BUILDER -----------------------
// +===============================================================+
class Builder {
    static template = '';

    // builder
    static build(entity) {
        // implement your print method here
        let raw = this.buildTemplate(entity);
        let element = this.buildElement(raw)
        return element;
    }
    static buildTemplate(entity = {}) {
        let tmp = this.template;
        tmp = this.addEmbeds(tmp, entity);
        return tmp;
    }
    static buildElement(raw = this.buildTemplate()) {
        raw = this.cleanSlots(raw);
        return new DOMParser().parseFromString(raw, 'text/html').body.firstElementChild;
    }

    // embbeder
    static addEmbeds(raw = this.template, entity = {}) {
        if (entity.embeds == undefined) return raw;
        for (let key of entity.embeds) {
            raw = raw.replaceAll('{{' + key + '}}', entity[key]);
        }
        return raw;
    }

    // slot manipulator
    static getSlots(raw = this.template) {
        return preg_match_all(/\[\[(?![^\]]*\/\])[^\]]*\]\]/g, raw);
    }
    static addSlot(original = this.template, slot_template = '', slotKey = '') {
        if (slotKey == '') return;
        // replace every = [[slot]]
        let slots = this.getSlots(original);
        for (let slot of slots) {
            if (slot == slotKey) {
                original = original.replaceAll(slot, slot_template);
                break;
            }
        }
        return original;
    }
    static cleanSlots(original = this.template) {
        let slots = this.getSlots(original);
        for (let slot of slots) {
            original = original.replaceAll(slot, '');
        }
        return original;
    }
}
class PostBuilder extends Builder {
    static template = `
        <div class='post-outer'>
            <article class='post hentry' itemprop='blogPost' itemscope='itemscope' itemtype='https://schema.opg/BlogPosting'>
                <div class="post-body entry-content" itemprop="articleBody">
                    <div class="box-deg">
                        <div class="post-thumbnail">
                            <div class="blanterimgthumb">
                                <a href="{{link}}"><img alt="{{title}}" height="74" itemprop="image" src="{{img_src}}" title="{{title}}" width="74"></a></div>
                            </div>
                        </div>							
                        <div class="box-body-deg">
                            [[post-label]]
                            <h2 class="post-title entry-title" itemprop="name headline">
                                <a href="{{link}}" itemprop="url" title="{{title}}">{{title}}</a>
                            </h2>
                            <div class="snippet-material" itemprop="description">{{description}}</div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    `;
}
class PostLabelBuilder extends Builder {
    static template = `
        <div class="label-info">
            <a href="{{label_link}}" rel="tag"><i class="fa-solid fa-hashtag"></i>{{label}}</a>
        </div>
    `
}
class PaginationLink extends Builder {
    static template = `
        <a class='BSearch-pagination' href='{{link}}'>	
            {{title}}
        </a>
    `
}
class EmptyPosts extends Builder {
    static template = `
        <div class='post-outer'>
            <article class='post hentry' itemprop='blogPost' itemscope='itemscope' itemtype='https://schema.opg/BlogPosting'>
                <div class="post-body entry-content" itemprop="articleBody">
                    <div class="box-deg" style='text-align:center;'>				                                           
                            <h2 class="post-title entry-title" itemprop="name headline">Empty Post</h2>
                            <div class="snippet-material" itemprop="description">Looks like there're post that can be found, you can go back to the homepage, by pressing button below..</div>
                            <a href='/' class='js-load e-waves'>Back To Home</a>
                    </div>
                </div>
            </article>
        </div>
    `
}
class ReloadPosts extends Builder {
    static template = `
        <div class='post-outer'>
            <article class='post hentry' itemprop='blogPost' itemscope='itemscope' itemtype='https://schema.opg/BlogPosting'>
                <div class="post-body entry-content" itemprop="articleBody">
                    <div class="box-deg" style='text-align:center;'>				                                           
                            <h2 class="post-title entry-title" itemprop="name headline">Oops!! Looks like there's a problem</h2>
                            <div class="snippet-material" itemprop="description">You can press button below to try again</div>
                            <a id='reload-posts-btn' href='javascript:Main.run();' class='js-load e-waves'>Reload Posts</a>
                    </div>
                </div>
            </article>
        </div>
    `
}
class PaginationLazyButton extends Builder {
    static template = `
        <a class="js-load e-waves"><i class="fa fa-angle-down"></i>Lainnya</a>
    `
}
class PaginationLazyLoader extends Builder {
    static template = `
        <span class="js-loading" style="cursor:wait;"><i class="fas fa-circle-notch fa-spin"></i></span>
    `
}
class PaginationMax extends Builder {
    static template = `
         <a class="js-load e-waves">Max Posts</a>
    `
}
class PaginationReload extends Builder {
    static template = `
         <a class="js-load e-waves">Reload Posts</a>
    `
}