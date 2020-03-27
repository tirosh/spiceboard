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
            lowestId: null,
            pagecount: 0
        },
        mounted: function() {
            this.getImages();
        },
        methods: {
            getImages: function() {
                var self = this;
                axios
                    .get('/images/' + self.lastImgId)
                    .then(function(imgs) {
                        console.log('imgs.data :', imgs.data);
                        var lastImg = imgs.data[imgs.data.length - 1];
                        self.lowestId = lastImg.lowestId;
                        console.log('lastImg.lowestId:', lastImg.lowestId);

                        console.log('lastImgId before:', self.lastImgId);
                        self.lastImgId = lastImg.id;
                        console.log('lastImgId after :', self.lastImgId);
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
