  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var container, stats;
    var camera, scene, renderer, backGeo, eyeGeoL;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var width = window.innerWidth;
    var height = window.innerHeight;

    var postprocessing = { enabled  : false };

    init();
    animate();

    function init() {

      container = document.createElement( 'div' );
      document.body.appendChild( container );

      camera = new THREE.PerspectiveCamera( 45, width / height, 1, 3000 );
      camera.position.z = 90;
      camera.target = new THREE.Vector3( 0, 0, 0 );
      
      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer( { antialias: false } );
      renderer.setSize( width, height );
      container.appendChild( renderer.domElement );
            
      var start = Date.now();

      var textureEnvRefl_A = new THREE.ImageUtils.loadTexture( 'textures/env/alex_refl_v01.jpg' );
      var textureEnvDiff_A = new THREE.ImageUtils.loadTexture( 'textures/env/alex_diff_v01.jpg' );
      var textureEnvBack_A = new THREE.ImageUtils.loadTexture( 'textures/env/alex_bg_v01.jpg' );

      var textureEnvRefl_B = new THREE.ImageUtils.loadTexture( 'textures/env/circus_refl_v01.jpg' );
      var textureEnvDiff_B = new THREE.ImageUtils.loadTexture( 'textures/env/circus_diff_v01.jpg' );
      var textureEnvBack_B = new THREE.ImageUtils.loadTexture( 'textures/env/circus_bg_v01.jpg' );

      var textureEnvRefl_C = new THREE.ImageUtils.loadTexture( 'textures/env/queen_refl_v01.jpg' );
      var textureEnvDiff_C = new THREE.ImageUtils.loadTexture( 'textures/env/queen_diff_v01.jpg' );
      var textureEnvBack_C = new THREE.ImageUtils.loadTexture( 'textures/env/queen_bg_v01.jpg' );

      var textureEnvRefl_D = new THREE.ImageUtils.loadTexture( 'textures/env/studio2_refl_v01.jpg' );
      var textureEnvDiff_D = new THREE.ImageUtils.loadTexture( 'textures/env/studio2_diff_v01.jpg' );
      var textureEnvBack_D = new THREE.ImageUtils.loadTexture( 'textures/env/studio2_bg_v01.jpg' );

      var textureEnvRefl_F = new THREE.ImageUtils.loadTexture( 'textures/env/valley_refl_v01.jpg' );
      var textureEnvDiff_F = new THREE.ImageUtils.loadTexture( 'textures/env/valley_diff_v01.jpg' );
      var textureEnvBack_F = new THREE.ImageUtils.loadTexture( 'textures/env/valley_bg_v01.jpg' );
      
      backMat = new THREE.MeshBasicMaterial( { map: textureEnvBack_A } );
      backGeo = new THREE.Mesh( new THREE.SphereGeometry( 2000, 64, 32 ), backMat );
      backGeo.scale.z = -1;
      scene.add( backGeo );                   
              
      var textureEyeColor = new THREE.ImageUtils.loadTexture( 'textures/eye/eye2_color_v01.jpg' );
        textureEyeColor.wrapS = THREE.RepeatWrapping;
        textureEyeColor.minFilter = textureEyeColor.magFilter = THREE.LinearFilter;
      var textureEyeNormal = new THREE.ImageUtils.loadTexture( 'textures/eye/eye2_normals_v01.png' );
        textureEyeNormal.wrapS = THREE.RepeatWrapping;
        textureEyeNormal.minFilter = textureEyeNormal.magFilter = THREE.LinearFilter;
      var uniforms = {
        texEyeCol: { type: "t", value: textureEyeColor },
        texEyeNrm: { type: "t", value: textureEyeNormal },
        texEnvRfl: { type: "t", value: textureEnvRefl_A },
        texEnvDif: { type: "t", value: textureEnvDiff_A },
        
        pupil_size:       { type: "f", value: 0.20 }, // pupil resting size
        iris_tex_start:     { type: "f", value: 0.009}, // V coordinate in texture where the iris color begins
        iris_tex_end:     { type: "f", value: 0.13 }, // V coordinate in texture where the iris color ends
        iris_border:      { type: "f", value: 0.00 }, // Insets the iris from the cornea
        iris_size:        { type: "f", value: 0.52 }, // Iris plane distance from origin
        iris_edge_fade:     { type: "f", value: 0.04 }, // Distance that sclera fades out onto cornea
        iris_inset_depth:   { type: "f", value: 0.03 }, // Distance that sclera shifts out onto cornea
        sclera_tex_scale:   { type: "f", value: -0.14}, // Controls V scale of sclera texture
        sclera_tex_offset:    { type: "f", value: 0.04 }, // Offsets sclera texture in V (leave at 0 to match iris)
        ior:          { type: "f", value: 1.30 }, // cornea index of refraction
        refract_edge_softness:  { type: "f", value: 0.10 }, // How far to fade out the back edge of the eye

        iris_texture_curvature: { type: "f", value: 0.50 }, // How much the iris bows inward for computing the pupil pos
        arg_iris_shading_curvature: { type: "f", value: 0.5 },  // How much the iris bows inward for computing normals and shadows

        tex_U_offset:     { type: "f", value: 0.25 }, // Rotate the texture around the eye
        cornea_bump_amount:   { type: "f", value: 0.10 }, // Adjust cornea normals to fake the cornea bulging out this much
        cornea_bump_radius_mult:{ type: "f", value: 0.90 }, // Multiply the radius of the cornea bump beyond the iris
        iris_normal_offset:   { type: "f", value: 0.00 }, // Offset the edge of the cornea for the cornea bump
        cornea_density:     { type: "f", value: 0.00 }, // Add fog to the cornea
        bump_texture:     { type: "f", value: 0.30 }, // Bump Texture value
        catshape:       { type: "i", value: 0    }, // Cat eye shape
        col_texture:      { type: "i", value: 1    }, // Enable color texture
      };
      var geometry = new THREE.IcosahedronGeometry( 30, 4 );
  
      material = new THREE.ShaderMaterial({ uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
      } );
      eyeGeoL = new THREE.Mesh(geometry, material );
      scene.add(eyeGeoL);
  
      initPostprocessing();

      renderer.autoClear = false;

      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = "0px";
      renderer.domElement.style.left = "0px";

      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      //container.appendChild( stats.domElement );

      container.addEventListener( 'mousedown', onMouseDown, false );
      container.addEventListener( 'mousemove', onMouseMove, false );
      container.addEventListener( 'mouseup', onMouseUp, false );
          
      window.addEventListener( 'resize', onWindowResize, false );

      var eyeController  = {
        pupil_size: 0.2,
        iris_tex_start: 0.009,
        iris_tex_end: 0.13,
        iris_border: 0.001,
        iris_size: 0.52,
        iris_edge_fade: 0.04,
        iris_inset_depth: 0.03,
        sclera_tex_scale: -0.14,
        sclera_tex_offset: 0.04,
        ior: 1.3,
        refract_edge_softness: 0.1,

        iris_texture_curvature: 0.51,
        arg_iris_shading_curvature: 0.51,

        tex_U_offset: 0.25,
        cornea_bump_amount: 0.1,
        cornea_bump_radius_mult: 0.9,
        iris_normal_offset: 0.001,
        cornea_density: 0.001,
        bump_texture: 0.3,
        catshape: false,
        col_texture: true
      };
      var shadingController = { envtex: 0 }
      var effectController  = {

        DOF: false,
        exposure:   1.0,
        focus:    1.0,
        aperture: 0.025,
        maxblur:  1.0

      };
      var matChanger = function( ) {
        for (var e in eyeController) {
          if (e in material.uniforms)
          material.uniforms[ e ].value = eyeController[ e ];
        }
      }
      var envChanger = function( ) {
        // TODO cleanup
        if( shadingController.envtex == 0 ){
          backMat.map = textureEnvBack_A;
          material.uniforms[ 'texEnvRfl' ].value = textureEnvRefl_A;
          material.uniforms[ 'texEnvDif' ].value = textureEnvDiff_A;
        }
        else if(shadingController.envtex == 1 ){
          backMat.map = textureEnvBack_B;
          material.uniforms[ 'texEnvRfl' ].value = textureEnvRefl_B;
          material.uniforms[ 'texEnvDif' ].value = textureEnvDiff_B;
        }
        else if( shadingController.envtex == 2 ){
          backMat.map = textureEnvBack_C;
          material.uniforms[ 'texEnvRfl' ].value = textureEnvRefl_C;
          material.uniforms[ 'texEnvDif' ].value = textureEnvDiff_C;
        }
        else if( shadingController.envtex == 3 ){
          backMat.map = textureEnvBack_D;
          material.uniforms[ 'texEnvRfl' ].value = textureEnvRefl_D;
          material.uniforms[ 'texEnvDif' ].value = textureEnvDiff_D;
        }
        else if( shadingController.envtex == 4 ){
          backMat.map = textureEnvBack_F;
          material.uniforms[ 'texEnvRfl' ].value = textureEnvRefl_F;
          material.uniforms[ 'texEnvDif' ].value = textureEnvDiff_F;
        }       
        backMat.needsUpdate = true;
        material.needsUpdate = true;
      }
      var postChanger = function( ) { 
        postprocessing.enabled = effectController.DOF;
        postprocessing.colcor.uniforms[ "mulRGB" ].value =  new THREE.Vector3( effectController.exposure, effectController.exposure, effectController.exposure );
        postprocessing.bokeh.uniforms[ "focus" ].value = effectController.focus;
        postprocessing.bokeh.uniforms[ "aperture" ].value = effectController.aperture;
        postprocessing.bokeh.uniforms[ "maxblur" ].value = effectController.maxblur;
      };

      var guiEye = new dat.GUI();
      var guiEyeProp = guiEye.addFolder('Eye properties');
      var guiEyeLght = guiEye.addFolder('Lighting / Shading');
      var guiEyeLens = guiEye.addFolder('Camera lens');
      
      guiEyeProp.add( eyeController, "pupil_size",      0.0, 1.0 ).name('Pupil size').onChange( matChanger );
  //    guiEyeProp.add( eyeController, "iris_tex_start",    0.0, 1.0 ).name('Iris V start').onChange( matChanger );
  //    guiEyeProp.add( eyeController, "iris_tex_end",      0.0, 1.0 ).name('Iris V end').onChange( matChanger );
      guiEyeProp.add( eyeController, "iris_size",       0.0, 1.0 ).name('Iris size').onChange( matChanger );
      guiEyeProp.add( eyeController, "iris_edge_fade",    0.0, 1.0 ).name('Iris edge fade').onChange( matChanger );
      guiEyeProp.add( eyeController, "iris_inset_depth",    0.0, 1.0 ).name('Iris edge inset').onChange( matChanger );
      guiEyeProp.add( eyeController, "sclera_tex_scale",    -1.0, 1.0 ).name('Sclera texture size').onChange( matChanger );
      guiEyeProp.add( eyeController, "sclera_tex_offset",   0.0, 1.0 ).name('Sclera texture offset').onChange( matChanger );
      guiEyeProp.add( eyeController, "ior",           1.01, 2.0 ).name('Cornea IOR').onChange( matChanger );
  //    guiEyeProp.add( eyeController, "refract_edge_softness", 0.0, 1.0 ).name('Refract edge softness').onChange( matChanger );
      guiEyeProp.add( eyeController, "iris_texture_curvature",    0.001, 1.0 ).name('Iris texture curvature').onChange( matChanger );
      guiEyeProp.add( eyeController, "arg_iris_shading_curvature",  0.001, 1.0 ).name('Iris shading curvature').onChange( matChanger );
      guiEyeProp.add( eyeController, "tex_U_offset",      0.0, 1.0 ).name('Texture U offset').onChange( matChanger );
      guiEyeProp.add( eyeController, "iris_border",       0.0, 1.0 ).name('Texture V offset').onChange( matChanger );
      guiEyeProp.add( eyeController, "cornea_bump_amount",  0.0, 0.2 ).name('Cornea bulging').onChange( matChanger );
      guiEyeProp.add( eyeController, "cornea_bump_radius_mult",0.0, 2.0 ).name('Cornea radius scale').onChange( matChanger );
      guiEyeProp.add( eyeController, "iris_normal_offset",  0.0, 1.0 ).name('Iris shading offset').onChange( matChanger );
      guiEyeProp.add( eyeController, "cornea_density",    0.0, 1.0 ).name('Cornea clouding').onChange( matChanger );
      guiEyeProp.add( eyeController, "bump_texture",      -1.0, 1.0 ).name('Bump texture').onChange( matChanger );
      guiEyeProp.add( eyeController, "catshape" ).name('Cat eye shape').onChange( matChanger );
      guiEyeProp.open();
      
      guiEyeLght.add( eyeController, "col_texture" ).name('Color texture map').onChange( matChanger );
      guiEyeLght.add( shadingController, 'envtex', { Alex: 0, Circus: 1, Queen: 2, Studio: 3, Valley: 4 } ).name('Environment').onChange( envChanger );       
      guiEyeLght.close();
      
      guiEyeLens.add( effectController, "DOF"   ).name('Camera Lens').onChange( postChanger );
      guiEyeLens.add( effectController, "exposure",     0.0, 5.0, 0.001 ).onChange( postChanger );
      guiEyeLens.add( effectController, "focus",        0.0, 3.0, 0.025 ).onChange( postChanger );
      guiEyeLens.add( effectController, "aperture",     0.001, 0.2, 0.001 ).onChange( postChanger );
      guiEyeLens.add( effectController, "maxblur",      0.0, 3.0, 0.025 ).onChange( postChanger );    
      guiEyeLens.close(); 
    }

    var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0, orbit = 0.1,
    lat = 15, isUserInteracting = false;


    function onMouseDown( event ) {

      event.preventDefault();

      isUserInteracting = true;

      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;

    }

    function onMouseMove( event ) {

      if ( isUserInteracting ) {
      
        lon = ( event.clientX - onPointerDownPointerX ) * 0.05 + onPointerDownLon;
        lat = ( event.clientY - onPointerDownPointerY ) * 0.05 + onPointerDownLat;
        orbit = 0.0;
      }
      mouseX = ( event.clientX - windowHalfX ) * 0.0015 ;
      mouseY = ( event.clientY - windowHalfY ) * 0.002 ;
    }

    function onMouseUp( event ) {
      
      isUserInteracting = false;
      orbit = 0.001;
    }

    function onWindowResize() {

      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize( width, height );
      postprocessing.composer.setSize( width, height );

    }

    function initPostprocessing() {
      var renderPass = new THREE.RenderPass( scene, camera );

      var bokehPass = new THREE.BokehPass( scene, camera, {
        focus:    1.0,
        aperture: 0.025,
        maxblur:  1.0,

        width: width,
        height: height
      } );

      bokehPass.renderToScreen = true;
      
      var colorCorrectionPass = new THREE.ShaderPass( THREE.ColorCorrectionShader );
      colorCorrectionPass.uniforms[ "powRGB" ].value = new THREE.Vector3( 1.0, 1.0, 1.0 );
      colorCorrectionPass.uniforms[ "mulRGB" ].value = new THREE.Vector3( 1.0, 1.0, 1.0 );
      
      var composer = new THREE.EffectComposer( renderer );

      composer.addPass( renderPass );
      composer.addPass( colorCorrectionPass );
      composer.addPass( bokehPass );
      
      postprocessing.composer = composer;
      postprocessing.colcor = colorCorrectionPass;
      postprocessing.bokeh = bokehPass;

    }

    function animate() {

      requestAnimationFrame( animate, renderer.domElement );

      render();
      stats.update();

    }

    function render() {
      var time = Date.now() * 0.001;
      material.uniforms.pupil_size.value = 0.2 * Math.sin( 0.5 * time ) + 0.3;

      //lon = time * 1.0;
      lat = Math.max( - 85, Math.min( 85, lat ) );
      phi = ( 90 - lat ) * Math.PI / 180;
      theta = lon * Math.PI / 180 ;

      // reposition camera to look at the eye
      phi += 0.3;
      theta += (Math.PI/2);
      
      camera.position.x = 90 * Math.sin( phi ) * Math.cos( theta );
      camera.position.y = 90 * Math.cos( phi );
      camera.position.z = 90 * Math.sin( phi ) * Math.sin( theta );   
      
      camera.lookAt( camera.target );

      eyeGeoL.lookAt( camera.position );
      eyeGeoL.rotateOnAxis( new THREE.Vector3( 1, 0, 0), mouseY );
      eyeGeoL.rotateOnAxis( new THREE.Vector3( 0, 1, 0), mouseX );  
      
      
      if ( postprocessing.enabled ) {

        postprocessing.composer.render( 0.1 );

      } else {

        renderer.clear();
        renderer.render( scene, camera );

      }

    }
    // FIN      