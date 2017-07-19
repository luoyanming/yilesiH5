<template>
    <div class="app-container">
        <div class="container-wrapper">
            
            <div id="lessonDocument"></div>

        </div>
    </div>
</template>

<script>
    import setTitle from "../common/js/setTitle.js"

    export default{
        data() {
            return {
                title: this.$route.query.title,
                documentId: this.$route.query.documentId,
                token: this.$route.query.token,
                host: this.$route.query.host
            }
        },
        methods : {
            init: function() {
                setTitle(this.title);

                var option = {
                    docId: this.documentId,
                    token: this.token,
                    host: this.host,
                    width: '100%',
                    pn: 1,
                    ready: function (handler) {
                        handler.setFontSize(1);
                        handler.setBackgroundColor("#FFF");
                        handler.setFontColor("#333");
                    },
                    flip: function (data) {
                        // console.log(data.pn);
                    },
                    fontSize: "big",
                    toolbarConf: {
                        page: true,
                        pagenum: true,
                        full: false,
                        copy: true,
                        position: "center"
                    }
                };

                new Document("lessonDocument", option);
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style lang="scss" scoped>
    /*#lessonDocument{
        position: relative;
        width: 100%;
        height: 100%;
    }*/
</style>