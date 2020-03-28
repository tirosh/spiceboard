console.log(`I'm not insane...`);
(function() {
    new Vue({
        el: '#main',
        components: {
            'img-upload': imgUpload,
            'img-card': imgCard,
            'img-modal': imgModal
        },
        data: {
            focusId: parseInt(location.hash.slice(1)),
            images: [],
            lastImgId: 0,
            lowestId: null,
            pagecount: 0
        },
        mounted: function() {
            var self = this;
            addEventListener('hashchange', function() {
                self.focusId = parseInt(location.hash.slice(1));
            });
            this.getImages();
        },
        methods: {
            getImages: function() {
                var self = this;
                axios
                    .get('/images/' + self.lastImgId)
                    .then(function(imgs) {
                        var lastImg = imgs.data[imgs.data.length - 1];
                        self.lowestId = lastImg.lowestId;
                        self.lastImgId = lastImg.id;
                        self.images = self.images.concat(imgs.data);
                    })
                    .catch(function(err) {
                        console.log('Error in GET /images :', err);
                    });
            },
            imgAdd: function(img) {
                this.images.unshift(img);
            },
            imgSelect: function(id) {
                this.focusId = id;
            },
            closeModal: function() {
                this.focusId = null;
                location.hash = '';
            }
        }
    });
})();
