console.log(`I'm not insane...`);
(function() {
    new Vue({
        el: '#main',
        components: {
            'container-images': containerImages
        },
        data: {
            images: [],
            title: '',
            desc: '',
            user: '',
            file: null
        }, // data ends
        methods: {
            handleImagesMounted: function(e) {
                console.log('images in handleImagesMounted :', images);
                self.images = images;
            },
            handleClick: function(e) {
                e.preventDefault();
                var self = this;

                var formData = new FormData();
                formData.append('title', this.title);
                formData.append('desc', this.desc);
                formData.append('user', this.user);
                formData.append('file', this.file);

                axios
                    .post('/upload', formData)
                    .then(function(resp) {
                        console.log('resp.data :', resp.data);
                        self.images.unshift(resp.data);
                    })
                    .catch(function(err) {
                        console.log('err in POST /upload: ', err);
                    });
            },
            closeModal: function(e) {
                console.log('this in closeModal :', this);
                this.id = null;
            },
            handleChange: function(e) {
                this.file = e.target.files[0];
            }
        } // methods ends
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
