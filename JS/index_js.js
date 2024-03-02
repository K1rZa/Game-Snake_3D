const canvas = document.getElementById('game')
const engine = new BABYLON.Engine(canvas, true)

const createScene = function () {
	const scene = new BABYLON.Scene(engine)
	scene.clearColor = new BABYLON.Color3.Black()

	var camera = new BABYLON.FreeCamera(
		'camera1',
		new BABYLON.Vector3(0, 1300, -900),
		scene
	)

	camera.setTarget(BABYLON.Vector3.Zero())

	camera.attachControl(canvas, true)

	var light = new BABYLON.HemisphericLight(
		'light',
		new BABYLON.Vector3(0, 1, 0),
		scene
	)

	light.intensity = 0.7

    const ground_material = new BABYLON.StandardMaterial("ground_material", scene)
    ground_material.diffuseColor = new BABYLON.Color3(0, 0.75, 0)

	var ground = BABYLON.MeshBuilder.CreateGround(
		'ground',
		{ width: 1152, height: 1152 },
		scene
	)
    ground.material = ground_material

	const box_material = new BABYLON.StandardMaterial('box_material', scene)
	box_material.diffuseColor = new BABYLON.Color3(1, 1, 1)

	var box = BABYLON.MeshBuilder.CreateBox(
		'box',
		{ width: 64, height: 64, depth: 64 },
		scene
	)
	box.material = box_material
	box.position.y = 32

	return scene
}

const sceneToRender = createScene()

engine.runRenderLoop(function () {
	sceneToRender.render()
})
