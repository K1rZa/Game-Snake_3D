const canvas = document.getElementById('game')

var engine = null
var scene = null
var sceneToRender = null

var tile = 32

var score = 0

var snake = {
	dirX: 0,
	dirZ: 0,
	posX: 0,
	posZ: 0,
	Length: 1,
	Last: 0,
}
var snakeArray = []

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - (min - 1))) + min
}
function getFoodPosition() {
	let x = getRandomInt(-9, 9) * tile
	let z = getRandomInt(-9, 9) * tile

	return {
		x: x,
		z: z,
	}
}

const startRenderLoop = function (engine, canvas) {
	engine.runRenderLoop(function () {
		if (sceneToRender && sceneToRender.activeCamera) {
			sceneToRender.render()
		}
	})
}
const createDefaultEngine = function () {
	return new BABYLON.Engine(canvas, true, {
		preserveDrawingBuffer: true,
		stencil: true,
		disableWebGL2Support: false,
	})
}

const createScene = function () {
	const scene = new BABYLON.Scene(engine)
	scene.clearColor = new BABYLON.Color3.FromHexString('#38597d')
	scene.createDefaultEnvironment({
		createSkybox: false,
		createGround: false,
		cameraContrast: 2,
	})

	const camera = new BABYLON.ArcRotateCamera(
		'RotateCamera',
		0,
		0,
		10,
		new BABYLON.Vector3(0, 750, -550),
		scene
	)
	camera.wheelDeltaPercentage = 0.01
	camera.setTarget(new BABYLON.Vector3(0, 16, 0))
	camera.attachControl(canvas, false)

	const globallight = new BABYLON.HemisphericLight(
		'globallight',
		new BABYLON.Vector3(0, 0.5, -0.3),
		scene
	)
	globallight.intensity = 0.8
	const dirlight = new BABYLON.DirectionalLight(
		'dirlight',
		new BABYLON.Vector3(-200, -400, 250),
		scene
	)
	dirlight.intensity = 0.4

	const shadow = new BABYLON.ShadowGenerator(512, dirlight)
	shadow.usePoissonSampling = true

	const groundMaterial = new BABYLON.StandardMaterial('groundMat', scene)
	groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3)
	const snakeHeadMaterial = new BABYLON.StandardMaterial('snakeHeadMat', scene)
	snakeHeadMaterial.diffuseColor = new BABYLON.Color3.FromHexString('#0969d6')
	const snakeCellMaterial = new BABYLON.StandardMaterial('snakeCellMat', scene)
	snakeCellMaterial.diffuseColor = new BABYLON.Color3.FromHexString('#09b1d6')
	const snakeCornerMaterial = new BABYLON.StandardMaterial('snakeCorMat', scene)
	snakeCornerMaterial.diffuseColor = new BABYLON.Color3.FromHexString('#064791')
	const foodMaterial = new BABYLON.StandardMaterial('foodMat', scene)
	foodMaterial.diffuseColor = new BABYLON.Color3.FromHexString('#ff0000')

	ground = BABYLON.MeshBuilder.CreateBox(
		'ground',
		{
			height: 32,
			width: 672,
			depth: 672,
		},
		scene
	)
	ground.position.y = -32
	ground.material = groundMaterial
	ground.receiveShadows = true

	food = BABYLON.MeshBuilder.CreateSphere(
		'food',
		{
			segments: 2,
			diameter: 32,
		},
		scene
	)
	food.position.x = getFoodPosition().x
	food.position.z = getFoodPosition().z
	food.material = foodMaterial
	food.castShadow = true
	food.receiveShadows = true
	shadow.getShadowMap().renderList.push(food)

	var hl = new BABYLON.HighlightLayer('hl1', scene)

	scene.registerBeforeRender(() => {

	})
	scene.registerAfterRender(() => {
		var score_draw = document.getElementById('score')
		score_draw.innerHTML = score
	})

	return scene
}

window.initFunction = async function () {
	var asyncEngineCreation = async function () {
		try {
			return createDefaultEngine()
		} catch (e) {
			console.log(
				'the available createEngine function failed. Creating the default engine instead'
			)
			return createDefaultEngine()
		}
	}

	window.engine = await asyncEngineCreation()
	if (!engine) throw 'engine should not be null.'
	startRenderLoop(engine, canvas)
	window.scene = createScene()
}
initFunction().then(() => {
	sceneToRender = scene
})
