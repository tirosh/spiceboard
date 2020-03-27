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
            // imgId: location.hash.slice(1),
            focusId: null,
            images: [],
            lastImgId: 0,
            pagecount: 0,
            imageToUpload: {},
            file: ''
        },
        mounted: function() {
            var self = this;
            axios
                .get('/images')
                .then(function(resp) {
                    console.log('resp.data :', resp.data);
                    self.images = resp.data;
                    self.lastImgId = self.images[self.images.length - 1].id;
                })
                .catch(function(err) {
                    console.log('Error in GET /images :', err);
                });
        },
        methods: {
            getMoreImages: function() {
                var self = this;
                axios
                    .get('/images/' + self.lastImgId)
                    .then(function(resp) {
                        console.log('resp.data :', resp.data);
                        self.images = self.images.concat(resp.data);
                        self.lastImgId = self.images[self.images.length - 1].id;
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
            }
        }
    });
})();

/*
- first, figure out the SMALLEST image id that's currrently onscreen

- making the more button disappear if there are no more images to get from the
  database

- check to see if the lowest id you retrieved from the images table earlier
  exists onscreen. if the lowest id you retrieved from the table exists on
  screen, then hide the more button
*/
