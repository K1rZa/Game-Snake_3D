const canvas = document.getElementById('game')
const engine = new BABYLON.Engine(canvas, true)

const tile = 32

var score = 0

function random_int(min, max) {
	return Math.floor(Math.random() * (max - (min - 1))) + min
}
function food_position() {
	let x = random_int(-9, 9) * tile
	let z = random_int(-9, 9) * tile
	return {
		x: x,
		z: z,
	}
}

const createScene = function () {
	const scene = new BABYLON.Scene(engine)
	scene.clearColor = new BABYLON.Color3.FromHexString('#38597d')
	scene.createDefaultEnvironment({
		createSkybox: false,
		createGround: false,
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

	camera.setTarget(new BABYLON.Vector3(0, 16, 0))
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

	var shadow = new BABYLON.ShadowGenerator(512, light)
	shadow.usePoissonSampling = true

	BABYLON.SceneLoader.ImportMesh(
		null,
		'./Resources/',
		'ground_alt.glb',
		scene,
		function (meshArray) {
			test_ground = meshArray[0]
			test_ground.scaling = new BABYLON.Vector3(320, 320, 320)
			test_ground.position = new BABYLON.Vector3(16, -16, -16)
			ShadowGenerator.addShadowCaster(test_ground)
			test_ground.receiveShadows = true
		}
	)

	BABYLON.SceneLoader.ImportMesh(
		null,
		'./Resources/',
		'test_box.glb',
		scene,
		function (meshArray) {
			test_box = meshArray[0]
			test_box.rotation = new BABYLON.Vector3(0, (Math.PI * 0) / 180, 0)
			test_box.scaling = new BABYLON.Vector3(20, 22, 32)
			test_box.position = new BABYLON.Vector3(0, 16, 0)
			ShadowGenerator.addShadowCaster(test_box)
			test_box.receiveShadows = true
		}
	)

	/*const box_material = new BABYLON.StandardMaterial('box_material', scene)
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
	shadow.getShadowMap().renderList.push(box)*/

	var food_material = new BABYLON.StandardMaterial('food_material', scene)
	food_material.diffuseColor = new BABYLON.Color3.Red()

	var food = BABYLON.MeshBuilder.CreateBox(
		'food',
		{ width: 32, height: 32, depth: 32 },
		scene
	)
	food.material = food_material
	food.position.y = 32

	food.position.x = food_position().x
	food.position.z = food_position().z

	/*BABYLON.SceneLoader.ImportMesh(
		null,
		'./Resources/',
		'food.glb',
		scene,
		function (meshArray) {
			food = meshArray[0]
			food.scaling = new BABYLON.Vector3(29, 29, 29)
			food.position.y = 16
			food.position.x = food_position().x
			food.position.z = food_position().z
			ShadowGenerator.addShadowCaster(food)
			food.receiveShadows = true
		}
	)*/

	var score_draw = document.getElementById('score')
	score_draw.innerHTML = score

	return scene
}

const sceneToRender = createScene()

engine.runRenderLoop(function () {
	sceneToRender.render()
})
