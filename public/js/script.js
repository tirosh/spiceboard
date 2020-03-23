console.log(`I'm not insane...`);
(function() {
    new Vue({
        el: '#main',
        data: {
            name: 'Vegeta',
            seen: true,
            cities: [
                {
                    name: 'Berlin',
                    country: 'DE'
                },
                {
                    name: 'Guayaquil',
                    country: 'Ecuador'
                },
                {
                    name: 'Ankara',
                    country: 'Turkey'
                },
                {
                    name: 'Bogotá',
                    country: 'Colombia'
                }
            ]
        }, // data ends
        methods: {
            myFunction: function() {
                console.log('myFunction is running');
            }
        } // methods ends
    });
})();
