<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 12px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	overflow: hidden;
    background: #F5F5F8;;
}

.search-page-header{
	.mint-search{
		height:2.2rem;
		width:100%;
		.mint-searchbar{
            padding: .35rem .75rem;
			background: #FAFBFD;
		}
		.mint-searchbar-inner{
            padding: 0;

            .mintui-search{
                display: none;
            }

            input{
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
    			font-size: 0.7rem;
    			padding: 0 .75rem;
            }
		}
		a.mint-searchbar-cancel{
			font-size: 0.75rem;
			color: #20B681;
		}
	}
}

.classify-search-btn{
	height:2.2rem;
	background: #FAFBFD;
	box-shadow: 0 1px 0 0 rgba(0,0,0,0.10);
	overflow : hidden;
	button{
		display: block;
		width:90%;
		height:1.5rem;
		font-size: 0.6rem;
		color: #CDCDCD;
		line-height: 0.9rem;
		margin:0.35rem auto;
		border: 1px solid #E5E5E5;
		border-radius: 0.1rem;
		background:#FFFFFF url("/static/icon_search1@2x.png") no-repeat 37% center;
		background-size: 0.55rem 0.6rem;
	}
}

footer{
    position: relative;
    z-index: 200;
	height:2.45rem;
	background: #FFFFFF;
	border-top: 1px solid rgba(0,0,0,0.10);
	p{
        overflow: hidden;
		font-size: 0.5rem;
		a{
			color: #999999;
			display: block;
			width:100%;
			text-align: center;
		}
		span{
			display: block;
			width:100%;
			height:2.45rem;
			text-align: center;
			padding-top: 1.6rem;
		}
	}
}

.overlay{
    position: absolute;
    top: 2rem;
    left:0;
    right:0;
    bottom: 0;
    opacity: 0.4;
    background: #000000;
    z-index: 99;
}

.mint-msgbox{
    width:70% !important;
    background: #FFFFFF;
    border-radius: 0.5rem !important;
    .mint-msgbox-message{
        font-size: 0.9rem;
        color: #333333 !important;
        line-height: 1.25rem !important;
        padding:4% 9% 0%;
    }
    .mint-msgbox-confirm{
        font-size: 0.9rem;
        color: #20B681;
        letter-spacing: 0;
        line-height: 1.25rem;
    }
}


.has-collected-with-result{
	.mint-cell-wrapper{
		background-image: none !important;
	}
}

.mint-tab-container-wrap{
	height:100%;
	overflow-y: auto;
}

</style>