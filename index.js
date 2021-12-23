import * as THREE from 'three';
import metaversefile from 'metaversefile';

const {useApp, useLoaders, usePhysics, useCleanup} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\/]*$/, '$1'); 


export default () => {  

    const app = useApp();
    const physics = usePhysics();
    const physicsIds = [];

    const loadModel = ( params ) => {

        return new Promise( ( resolve, reject ) => {

            const { gltfLoader } = useLoaders();
            const { dracoLoader } = useLoaders();
            gltfLoader.setDRACOLoader( dracoLoader );
    
            gltfLoader.load( params.filePath + params.fileName, function( gltf ) {
    
                let numVerts = 0;
    
                gltf.scene.traverse( function ( child ) {

                    const physicsId = physics.addGeometry( child );
                    physicsIds.push( physicsId );
    
                    if ( child.isMesh ) {
    
                        numVerts += child.geometry.index.count / 3;  
    
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                    }
                });
    
                console.log( `Silk Fountain 01 modelLoaded() -> ${ params.fileName } num verts: ` + numVerts );

                resolve( gltf.scene );     
            });
        })
    }

    loadModel( { 
        filePath: baseUrl,
        fileName: 'ruin.glb',
        pos: { x: 0, y: 0, z: 0 },
    } ).then ( 
        model => {

            let ruin1 = model.clone();
            ruin1.position.set( 329, 5, 134 );

            let ruin2 = model.clone();
            ruin2.position.set( -232, -1, -198 );

            let ruin3 = model.clone();
            ruin3.position.set( -408, 20, 262 );

            app.add( ruin1, ruin2, ruin3 );
            
            model.updateMatrixWorld();
            ruin1.updateMatrixWorld();
            ruin2.updateMatrixWorld();
            ruin3.updateMatrixWorld();
        }
    )


    useCleanup(() => {
      for (const physicsId of physicsIds) {
       physics.removeGeometry(physicsId);
      }
    });

    return app;
}