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
            lastImageId: '',
            pagecount: 0,
            imageToUpload: {},
            file: ''
        },
        mounted: function() {
            console.log('this.imgId :', this.imgId);
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
        methods: {
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
