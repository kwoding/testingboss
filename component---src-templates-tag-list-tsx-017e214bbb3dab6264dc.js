"use strict";(self.webpackChunktestingboss=self.webpackChunktestingboss||[]).push([[775],{856:function(e,t,a){a.d(t,{Z:function(){return u}});var l=a(7294),n=a(8032),s=a(1883),r="blog-list-module--blog-list--8ca92",i="blog-list-module--card--710b0",c="blog-list-module--cards--0638b",o="blog-list-module--cta--6e34c",m="blog-list-module--image--aa2ec",d="blog-list-module--text--d2b17";var u=function(e){let{posts:t}=e;return l.createElement("nav",{className:r},l.createElement("ul",{className:c},t.map((e=>{let{node:t}=e;const a=t.frontmatter.title||t.fields.slug;return l.createElement("li",{key:t.fields.slug,className:i},l.createElement(s.rU,{to:"/blog"+t.fields.slug,title:a},l.createElement("div",{className:m},l.createElement(n.G,{image:t.frontmatter.thumbnail.childImageSharp.gatsbyImageData,alt:a})),l.createElement("div",{className:d},l.createElement("header",null,l.createElement("h3",null,a)),l.createElement("section",null,l.createElement("p",{dangerouslySetInnerHTML:{__html:t.frontmatter.description||t.excerpt}}),l.createElement("p",{className:o},"Read More →")))))}))))}},5322:function(e,t,a){a.r(t),a.d(t,{default:function(){return m}});var l=a(7294),n=a(1590),s=a(6214),r=a(2825),i="tag-list-module--post-count--ff8d3",c="tag-list-module--tag-list--44964",o=a(856);var m=function(e){let{data:t,location:a,pageContext:m}=e;const d=t.site.siteMetadata.title,u=t.site.siteMetadata.description,{siteUrl:g}=t.site.siteMetadata,{tag:f}=m,{totalCount:p}=t.allMarkdownRemark,b=t.allMarkdownRemark.edges;return l.createElement(s.Z,{location:a,title:d},l.createElement(r.Z,{title:d,description:u,image:g+n.Z,url:g+"/tag/"+f}),l.createElement("div",{className:c},l.createElement("h2",null,f),l.createElement("div",{className:i},"There"," ",1===p?"is 1 post":"are "+p+" posts"," ",'under "',f,'"'),l.createElement(o.Z,{posts:b})))}},1590:function(e,t,a){t.Z=a.p+"static/default-content-image-541ed34bfa50674e941a911d4953f362.jpg"}}]);
//# sourceMappingURL=component---src-templates-tag-list-tsx-017e214bbb3dab6264dc.js.map