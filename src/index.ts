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

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
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

    // Load an environment map if not set in the glb file
    // await viewer.setEnvironmentMap((await manager.importer!.importSinglePath<ITexture>("./assets/environment.hdr"))!);

    // Add some UI for tweak and testing.
    const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)

    //viewer.scene.activeCamera.position.set(-5,0, 1.5);


    function setupScrollAnimation(){
        const tl = gsap.timeline()
    
        // second section
        tl
        .to(position, {x: -0.44, y: 7.8,z: 1.9,
            scrollTrigger:{
                trigger: '#second', 
                start: 'top bottom',  
                end: 'top top', 
                scrub: true},
             onUpdate})
            .to(target, {x: 0.2, y:-0.07,z: 1.61,
                scrollTrigger:{
                    trigger: '#second', 
                    markers: true,
                    start: 'top bottom',  
                    end: 'top top', 
                    scrub: true
                }})

        // third section
        .to(position, {x: -0.43, y: -0.26,z: 3.9, 
            scrollTrigger:{
                trigger: '#third', 
                markers: true,
                start: 'top bottom',  
                end: 'top top', 
                scrub: true},
             onUpdate})
            .to(target, {x: -0.74, y: 0.05,z: 1.12,
                scrollTrigger:{
                    trigger: '#third', 
                    start: 'top bottom',  
                    end: 'top top', 
                    scrub: true},
                })
    }

    setupScrollAnimation()

    let needsupdate = true
    function onUpdate(){
        needsupdate = true
        viewer.renderer.resetShadows()
    }

    viewer.addEventListener('preFrame', ()=>{
        if(needsupdate){
            camera.positionUpdated(true)
            camera.targetUpdated(true)
            needsupdate = false 
        }
    })
}


setupViewer()
