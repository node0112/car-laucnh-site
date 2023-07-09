import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,


    //addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin,

} from "webgi";
import "./styles.css";

import gsap from 'gsap'

import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger)
async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target 

    // Add a popup(in HTML) with download progress when any asset is downloading.
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    await viewer.addPlugin(BloomPlugin)

    // or use this to add all main ones at once.
    //await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    // Import and add a GLB file.
    await viewer.load("./assets/car_model.glb")

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})
    window.scrollTo({top: 0, left: 0 })

    let needsUpdate = true
    function onUpdate(){
        needsUpdate = true
        viewer.setDirty()
    }

    viewer. addEventListener ("preFrame", () => {
        if(needsUpdate){
            camera.positionUpdated(true)
            needsUpdate = false 
        }
    })

    scrollAnimation(position, target, onUpdate)

    //setting up the inters obs to prevent ovberscroll of content-section at enxd

    const options = {
        root: document.querySelector('section-container'),
        threshold: 0.72,
        rootMargin: '150px'
    }
    const obsElem = document.getElementById('fourth')
    const footer=  document.querySelector('.footer')

    const observer = new IntersectionObserver(obj =>{
        console.log(obj[0].intersectionRatio)
        if(obj[0].isIntersecting){
         document.querySelector('.section-container').style.overflowY = 'hidden'
         document.querySelector('.section-container').style.scrollSnapType = 'none'
        }
    }, options)
    
    const footerObs = new IntersectionObserver(obj =>{
        console.log(obj[0].intersectionRatio + 'footer')
        if(!obj[0].isIntersecting){
         console.log('not interesct')
         document.querySelector('.section-container').style.overflowY = 'scroll'
         document.querySelector('.section-container').style.scrollSnapType = 'y mandatory'
        }
    })

    observer.observe(obsElem)
    footerObs.observe(footer)

}

function scrollAnimation(position, target, onUpdate){
    const tl = gsap.timeline()

    tl.to(position,{
        x: -0.44, 
        y: 7.8,
        z: 1.9,
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#second',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            immediateRender: false
        },
        onUpdate
    })
    .to(target,{
        x: 0.2, 
        y:-0.07,
        z: 1.61,
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#second',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            immediateRender: false
        },
    })
    .to('#second',{
        opacity: '1',
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#second',
            start: 'top bottom',
            end: 'top 80%',
            scrub: true,
            immediateRender: false
        },
    })
    //third section
    .to(position,{
        x: -0.43, 
        y: -0.26,
        z: 3.9,
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#third',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            immediateRender: false
        },
        onUpdate
    })
    .to(target,{
        x: -0.74, 
        y: 0.05,
        z: 1.12,
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#third',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            immediateRender: false
        },
    })
    .to('#third',{
        opacity: '1',
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#third',
            start: 'top bottom',
            end: 'top 80%',
            scrub: true,
            immediateRender: false
        },
    })
    //fourth
    .to(position,{
        x: 1.97, 
        y: -0.11,
        z: -3.84,
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#fourth',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            immediateRender: false
        },
        onUpdate
    })
    .to(target,{
        x: -0.16, 
        y: 0.13,
        z: 1.25,
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#fourth',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            immediateRender: false
        },
    })
    .to('#fourth',{
        opacity: '1',
        scrollTrigger: {
            scroller: '.section-container',
            trigger: '#fourth',
            start: 'top bottom',
            end: 'top 80%',
            scrub: true,
            immediateRender: false
        },
    })
}


setupViewer()
