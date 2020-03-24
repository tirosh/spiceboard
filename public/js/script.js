console.log(`I'm not insane...`);
(function() {
    new Vue({
        el: '#main',
        data: {
            images: [],
            title: '',
            desc: '',
            user: '',
            file: null
        }, // data ends
        // mounted is a lifecycle method ...
        mounted: function() {
            var self = this;
            axios
                .get('/images')
                .then(function(resp) {
                    self.images = resp.data.reverse();
                })
                .catch(function(err) {
                    console.log('Error in GET /images :', err);
                });
        },
        methods: {
            handleClick: function(e) {
                e.preventDefault();
                var self = this;

                var formData = new FormData();
                formData.append('title', this.title);
                formData.append('description', this.desc);
                formData.append('username', this.user);
                formData.append('file', this.file);

                axios
                    .post('/upload', formData)
                    .then(function(resp) {
                        self.images.unshift(resp.data);
                    })
                    .catch(function(err) {
                        console.log('err in POST /upload: ', err);
                    });
            },
            handleChange: function(e) {
                this.file = e.target.files[0];
            }
        } // methods ends
    });
})();
