const canvas = document.getElementById('game')
const engine = new BABYLON.Engine(canvas, true)

const createScene = function () {
	const scene = new BABYLON.Scene(engine)
	scene.clearColor = new BABYLON.Color3.Black()

	var camera = new BABYLON.ArcRotateCamera(
		'camera',
		0,
		0,
		10,
		new BABYLON.Vector3(0, 600, -800),
		scene
	)

	camera.wheelDeltaPercentage = 0.1

	camera.setTarget(BABYLON.Vector3.Zero())

	camera.attachControl(canvas, true)

	var light = new BABYLON.DirectionalLight(
		'light',
		new BABYLON.Vector3(-100, -500, 250),
		scene
	)

	light.intensity = 0.8

	const ground_material = new BABYLON.StandardMaterial('ground_material', scene)
	ground_material.diffuseColor = new BABYLON.Color3(0, 0.75, 0)

	var ground = BABYLON.MeshBuilder.CreateGround(
		'ground',
		{ width: 672, height: 672 },
		scene
	)
	ground.receiveShadows = true
	ground.material = ground_material

	const box_material = new BABYLON.StandardMaterial('box_material', scene)
	box_material.diffuseColor = new BABYLON.Color3(1, 1, 1)

	var box = BABYLON.MeshBuilder.CreateBox(
		'box',
		{ width: 32, height: 32, depth: 32 },
		scene
	)
	box.material = box_material
	box.position.y = 16

	var shadow = new BABYLON.ShadowGenerator(512, light)
	shadow.usePoissonSampling = true
	shadow.getShadowMap().renderList.push(box)

	return scene
}

const sceneToRender = createScene()

engine.runRenderLoop(function () {
	sceneToRender.render()
})
