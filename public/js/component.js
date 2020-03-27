dateOptions = {
    weekday: 'short',
    // year: 'numeric',
    // month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    dayPeriod: 'short',
    minute: 'numeric'
    // second: 'numeric'
};

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
            e.preventDefault();
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
            e.preventDefault();
            var self = this;
            axios
                .post('/comment', {
                    comment: self.comment,
                    user: self.user,
                    id: self.id
                })
                .then(function(resp) {
                    console.log('resp.data :', resp.data);
                    self.getComments();
                })
                .catch(function(err) {
                    console.log('ERROR in POST /comment: ', err);
                });
        },
        onSelect: function(e) {
            this.file = e.target.files[0];
        },
        getComments: function() {
            var self = this;
            axios
                .get(`/comments/${self.id}`)
                .then(function(comments) {
                    console.log('Successfully got comments ', comments.data);
                    self.comments = comments.data;
                    for (let i = 0; i < self.comments.length; i++) {
                        self.comments[i].created_at = new Intl.DateTimeFormat(
                            'en-US',
                            dateOptions
                        ).format(new Date(self.comments[i].created_at));
                    }
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
        // 'img-comment': imgComment
    },
    props: { id: Number }, // TODO: look into custom validation options
    data: function() {
        return {
            img: Object,
            comments: Array
        };
    },
    mounted: function() {
        // console.log('this.id :', this.id);
        var self = this;
        axios
            .get(`/image/${self.id}`)
            .then(function(img) {
                // console.log('Successfully got image ', img.data[0]);
                self.img = img.data[0];
            })
            .catch(function(err) {
                console.log('Error getting image: ', err);
            });
    },
    methods: {
        close: function() {
            this.$emit('close-modal');
        }
    }
};
