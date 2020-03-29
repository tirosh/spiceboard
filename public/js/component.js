function formatDate(ISOstring) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        hour: 'numeric',
        dayPeriod: 'short',
        minute: 'numeric',
        hour12: false
    }).format(new Date(ISOstring));
}

var imgCard = {
    template: '#tmpl-img-card',
    props: { img: Object },
    data() {
        return { selected: false };
    },
    methods: {
        select() {
            this.$emit('selected', this.img.id);
            this.selected = this.selected === true ? false : true;
        }
    }
};

var imgUpload = {
    template: '#tmpl-img-upload',
    data() {
        return {
            file: null,
            title: '',
            desc: '',
            user: ''
        };
    },
    methods: {
        onSubmit: function(e) {
            var self = this;

            var formData = new FormData();
            formData.append('file', this.file);
            formData.append('title', this.title);
            formData.append('desc', this.desc);
            formData.append('user', this.user);

            axios
                .post('/upload', formData)
                .then(function(resp) {
                    // always use kebab-case for event names
                    self.$emit('new-image', resp.data);
                    self.$refs.file.value = '';
                    self.title = '';
                    self.desc = '';
                    self.user = '';
                })
                .catch(function(err) {
                    console.log('ERRR in POST /upload: ', err);
                });
        },
        onSelect: function(e) {
            this.file = e.target.files[0];
        }
    }
};

var comments = {
    template: '#tmpl-comments',
    props: { id: Number },
    data() {
        return {
            user: '',
            comment: '',
            comments: Array
        };
    },
    mounted() {
        console.log('this.id :', this.id);
        this.getComments();
    },
    methods: {
        onSubmit: function(e) {
            var self = this;
            axios
                .post('/comment', {
                    comment: self.comment,
                    user: self.user,
                    id: self.id
                })
                .then(function() {
                    self.getComments();
                })
                .catch(function(err) {
                    console.log('ERROR in POST /comment: ', err);
                });
        },
        getComments: function() {
            var self = this;
            axios
                .get('/comments/' + self.id)
                .then(function(comments) {
                    self.comments = comments.data;
                    for (let i = 0; i < self.comments.length; i++) {
                        self.comments[i].created_at = formatDate(
                            self.comments[i].created_at
                        );
                    }
                    self.comment = '';
                    self.user = '';
                })
                .catch(function(err) {
                    console.log('ERROR in GET /comments: ', err);
                });
        }
    }
};

var imgModal = {
    template: '#tmpl-img-modal',
    components: {
        'img-comments': comments
    },
    props: { id: Number }, // TODO: look into custom validation options
    data: function() {
        return { img: Object };
    },
    watch: {
        id: function() {
            this.getModalImage();
        }
    },
    mounted: function() {
        this.getModalImage();
    },
    methods: {
        getModalImage: function() {
            var self = this;
            axios
                .get(`/image/${self.id}`)
                .then(function(img) {
                    if (img.data[0] === undefined) return self.close();
                    self.img = img.data[0];
                    self.img.created_at = formatDate(self.img.created_at);
                })
                .catch(function(err) {
                    console.log('Error getting image: ', err);
                });
        },
        close: function() {
            this.$emit('close-modal');
        }
    }
};
