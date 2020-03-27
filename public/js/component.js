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
                    console.log('err in POST /upload: ', err);
                });
        },
        onSelect: function(e) {
            this.file = e.target.files[0];
        }
    }
};

// var imgComment = {
//     template: '#tmpl-comment',
//     props: { comment: Object }
// };

var addComment = {
    template: '#tmpl-add-comment',
    props: { id: Number },
    data() {
        return {
            comment: '',
            user: ''
        };
    },
    mounted() {
        console.log('this.id :', this.id);
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
                    // always use kebab-case for event names!!
                    // self.$emit('new-image', resp.data);
                })
                .catch(function(err) {
                    console.log('err in POST /comment: ', err);
                });
        },
        onSelect: function(e) {
            this.file = e.target.files[0];
        }
    }
};

var imgModal = {
    template: '#tmpl-img-modal',
    components: {
        'add-comment': addComment
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
        console.log('this.id :', this.id);
        var self = this;
        Promise.all([
            axios.get(`/image/${self.id}`).then(function(img) {
                // console.log('Successfully got image ', img.data[0]);
                return img.data[0];
            }),
            axios.get(`/comments/${self.id}`).then(function(comments) {
                // console.log('Successfully got comments ', comments.data);
                return comments.data;
            })
        ])
            .then(function(dbDataArr) {
                console.log('dbDataArr :', dbDataArr);
                self.img = dbDataArr[0];
                self.comments = dbDataArr[1];
                console.log('typeof dbDataArr[1] :', typeof dbDataArr[1]);
                console.log('self.comments :', self.comments);
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
