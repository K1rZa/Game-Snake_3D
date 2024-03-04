const canvas = document.getElementById('game')
const engine = new BABYLON.Engine(canvas, true)

const tile = 32

const createScene = function () {
	const scene = new BABYLON.Scene(engine)
	scene.clearColor = new BABYLON.Color3.FromHexString('#38597d')
	scene.createDefaultEnvironment({
		createSkybox: false,
		createGround: true,
		cameraContrast: 2,
	})

	var camera = new BABYLON.ArcRotateCamera(
		'camera',
		0,
		0,
		10,
		new BABYLON.Vector3(0, 600, -800),
		scene
	)

	camera.wheelDeltaPercentage = 0.01

	camera.setTarget(BABYLON.Vector3.Zero())
	camera.attachControl(canvas, true)

	var light = new BABYLON.DirectionalLight(
		'light',
		new BABYLON.Vector3(-100, -500, 250),
		scene
	)

	light.intensity = 0.4

	var light_global = new BABYLON.HemisphericLight(
		'light_global',
		new BABYLON.Vector3(0, 0.5, -0.3),
		scene
	)

	light_global.intensity = 1

	/*const ground_material = new BABYLON.StandardMaterial('ground_material', scene)
	ground_material.diffuseColor = new BABYLON.Color3(0, 0.75, 0)

	var ground = BABYLON.MeshBuilder.CreateBox(
		'ground',
		{ width: 672, height: 32, depth: 672 },
		scene
	)
	ground.material = ground_material
	ground.receiveShadows = true*/

	BABYLON.SceneLoader.ImportMesh(
		null,
		'./Resources/',
		'test_ground.glb',
		scene,
		function (meshArray) {
			test = meshArray[0]
			test.scaling = new BABYLON.Vector3(320, 320, 320)
			test.position = new BABYLON.Vector3(16, -16, -16)
			shadow.addShadowCaster(test)
			test.receiveShadows = true
		}
	)

	const box_material = new BABYLON.StandardMaterial('box_material', scene)
	box_material.diffuseColor = new BABYLON.Color3.FromHexString('#09b1d6')

	var box = BABYLON.MeshBuilder.CreateBox(
		'box',
		{ width: 32, height: 32, depth: 32 },
		scene
	)
	let x = 0
	let z = 0
	box.material = box_material
	box.position.x = x
	box.position.z = z

	box.position.y = 32

	var shadow = new BABYLON.ShadowGenerator(512, light)
	shadow.usePoissonSampling = true
	shadow.getShadowMap().renderList.push(box)

	return scene
}

const sceneToRender = createScene()

engine.runRenderLoop(function () {
	sceneToRender.render()
})
