var cardImage = {
    template: '#tmpl-card-image',
    props: {
        id: { type: Number, defualt: null, required: true },
        title: { type: String, defualt: '' },
        desc: { type: String, defualt: '' },
        user: { type: String, defualt: '' },
        url: { type: String, defualt: null, required: true }
    },
    data() {
        return { selected: false };
    },
    methods: {
        select() {
            this.$emit('selected', this.id);
            this.selected = this.selected === true ? false : true;
        }
    }
};

var containerImages = {
    template: '#tmpl-container-images',
    components: { 'card-image': cardImage },
    data() {
        return { images: [] };
    },
    mounted: function() {
        this.getImages();
    },
    methods: {
        getImages() {
            var self = this;
            axios
                .get('/images')
                .then(function(resp) {
                    self.images = resp.data;
                })
                .catch(function(err) {
                    console.log('Error in GET /images :', err);
                });
        },
        imagesMounted() {
            console.log('I was called!!');
            this.$emit('imagesMounted');
        }
    }
};

Vue.component('modal', {
    template: '#tmpl-modal',
    props: { id: Number },
    data: function() {
        return {
            title: '',
            desc: '',
            user: '',
            file: null
        };
    },
    methods: {
        pleaseCloseMe: function() {
            console.log('EMITTING pleaseCloseMe EVENT');
            this.$emit('alter', 'Bonjour');
        }
    }
});

// Attempt of an upload form component.
///////////////////////////////////////////
// Vue.component('upload-image', {
//     template: '#tmpl-upload-image',
//     props: {
//         // images: []
//         // title: { type: String, defualt: '' },
//         // desc: { type: String, defualt: '' },
//         // user: { type: String, defualt: '' },
//         // file: { type: String, defualt: null }
//     },
//     data() {
//         return {
//             file: { type: String, defualt: null },
//             title: { type: String, defualt: '' },
//             desc: { type: String, defualt: '' },
//             user: { type: String, defualt: '' }
//         };
//     },
//     methods: {
//         onSubmit: function(e) {
//             e.preventDefault();
//             var self = this;
//             var formData = new FormData();
//             formData.append('title', this.title);
//             formData.append('description', this.desc);
//             formData.append('username', this.user);
//             formData.append('file', this.file);
//             axios
//                 .post('/upload', formData)
//                 .then(function(resp) {
//                     self.images.unshift(resp.data);
//                 })
//                 .catch(function(err) {
//                     console.log('err in POST /upload: ', err);
//                 });
//         },
//         onSelect: function(e) {
//             this.file = e.target.files[0];
//         }
//     }
// });
