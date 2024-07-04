class BlogPostEntity{
	/*
	author    : [{…}]
	content   : {type: 'html', $t: '<p>&nbsp;<span style="background-color: white; fon…, ut interdum velit lobortis eu.</span>&nbsp;</p>'}
	id        : {$t: 'tag:blogger.com,1999:blog-5950330201730594593.post-5916909838795192142'}
	link      : (5) [{…}, {…}, {…}, {…}, {…}]
	published : {$t: '2024-06-27T21:32:00.002-07:00'}
	thr$total : {$t: '0'} 
	title     : {type: 'text', $t: 'Testing Artikel 231456'}
	updated   : {$t: '2024-06-27T21:32:54.257-07:00'}
	*/
	constructor(entry){
		this.authors      = this.buildAuthors(entry.author);  
		this.content      = entry.content.$t;
		this.content_type = entry.content.type;
		this.published    = entry.published.$t;
		this.updated 	  = entry.updated.$t;	
		this.links        = entry.link;
	}
	buildAuthors(authors){
		let cont = [];
		for(let author of authors)
			cont.push( new BlogAuthorEntity(author) );		
		return cont;
	}
}
class BlogAuthorEntity{
	/*
	email    : {$t: 'noreply@blogger.com'}
	gd$image : {rel: 'http://schemas.google.com/g/2005#thumbnail', width: '32', height: '17', src: '//blogger.googleusercontent.com/img/b/R29vZ2xl/AVv…u8TH_TkhcmSEWC5uR73LQZbpVCazJ/s220/cs-snedel.webp'}
	name     : {$t: 'Gilang Ramadhan'}
	uri      : {$t: 'http://www.blogger.com/profile/07000369991075541029'}
	*/
	constructor(author_entry){
		this.email = author_entry.email.$t;
		this.image = author_entry.gd$image;
		this.name  = author_entry.name.$t;
		this.uri   = author_entry.uri.$t;
	}
}
class BlogSearch{
	constructor( object = {} ){
		this.BlogSearchInfo = new BlogSearchInfo( object );
		this.BlogPagination = new  
		this.BlogSearchApi  = new BlogSearchApi( this.BlogSearchInfo );
		this.BlogPosts      = [];
	}
	async run(){
		// call response json
		let response = await this.BlogSearchApi.call();
		// start building the entity data
		if(response.feed !== undefined){
			// get the data for pagination and posts

		} else {
			
		}
	}
	resetEntity(){
		this.BlogPosts = [];
	}
	// entry = response.entry
	buildEntity(entry){

	}
}
class Queries {
	constructor(object){
		this.queries = {};
	}
	fill( path = '?' ){
		for( let key in queries ){
			if( path.length != 1 ) path += '&';
			if( Array.isArray(queries[key]) ) {
				for( let value of queries[key] ) {
					if( path.length != 1 ) path += '&';
					path += key + '=' + value;          
				}
			} else {
				path += key + '=' + queries[key];          
			}
		}
		return path;
	}
	build(object = {}){
		for( let key in Object.fromEntries(object.entries()) ){
			if ( !this.validation(key,this.queries[key]) ) continue;	
			this.queries[key] = object[key];
		}
	}
	validation( key,value ) {
		// implement your validation method here
		return true; 	
	}
	reset(){
		this.queries = {};
	}
}
class BlogPagination{
	constructor(object){
			
	}
	build(blog_info){
		console.log(blog_info);
	}
}
class BlogSearchInfo{
	// This class is entity to the information that the blogger has, like query and etc
	constructor(location = window.location){
		this.host     = location.host;
		this.hostname = location.hostname;
		this.origin   = location.origin;
		this.pathname = location.pathname;
		this.label    = undefined;
		this.queries = {
			'current-page' : 1,      
		}; 
		this.reset();
		this.build();
	}  
	// build queries
	validator( key,value ) {
		if(key == 'current-page' && value <= 0) return false;  
		return true;
	}
	build(){
		this.buildQueries();
		this.buildLabel();
	}
	buildQueries(path = window.location.search){
		const params = new URLSearchParams(window.location.search)
		for( let key in Object.fromEntries(params.entries()) ){
			if ( !this.validator(key,this.queries[key]) ) continue;
			if ( params.getAll(key).length > 1 ) this.queries[key] = params.getAll(key);          
			else                                 this.queries[key] = params.get(key);                
		}
	}
	buildLabel(path = window.location.pathname){
		let paths = path.split('/');
		// url / "/search/label/[label-name]"
		if(paths[1] == 'search' && paths[2] == 'label')
			this.label = paths[3];
	}
	// getter setter
	get(key){
		return this[key];
	}
	set(key,value){
		this[key] = value;    
	}  
	reset(){
		this.queries = {
			'current-page' : 1,      
		}; 
	}
}

class BlogSearchApi{
	constructor(blog_info){
		this.url      = '';
		this.queries  = '';
		this.path     = '';
		this.target   = '/feeds/posts/default';
		this.property = {      
			'start-index' : 1,
			'max-result' : 6,
			'alt' : 'json',
		}
		this.build(blog_info);
	} 
	async call(url = this.url){
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
		return response.json();
	}
	build( blog_info ) {
		// /1|l0v3|u|354\ 
		if(blog_info instanceof BlogSearchInfo == false) 
			throw Error('Blog info should be instance of BlogSearchInfo');

		// api queries
		this.queries = this.buildQueries(blog_info);
		this.path    = '';

		// determine if there's a label search or not
		if(blog_info.label != undefined) this.path = '/-/' + blog_info.label;

		// return combine with the api_path
		this.url = blog_info.origin + this.target + this.path + this.queries;
	}
	buildQueries( blog_info, path = '?' ){    
		// setup pagination propety
		let queries = this.property;
		queries['start-index'] += ( this.property["max-result"] * ( blog_info.queries['current-page'] - 1 ) );

		for( let key in queries ){
			if( path.length != 1 ) path += '&';
			if( Array.isArray(queries[key]) ) {
				for( let value of queries[key] ) {
					if( path.length != 1 ) path += '&';
					path += key + '=' + value;          
				}
			} else {
				path += key + '=' + queries[key];          
			}
		}
		return path;
	}
}

