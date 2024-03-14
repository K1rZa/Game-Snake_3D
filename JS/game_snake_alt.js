const canvas = document.getElementById('game')

var engine = null
var scene = null
var sceneToRender = null

var tile = 32

var score = 0
var speed = 150

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
	//camera.attachControl(canvas, false)

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
	snakeHeadMaterial.diffuseColor = new BABYLON.Color3.FromHexString('#06819c')
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
		if (Date.now() - snake.Last >= speed) {
			snake.posX += snake.dirX
			snake.posZ += snake.dirZ
			snakeCell = BABYLON.MeshBuilder.CreateBox('snakeCell', {
				height: 32,
				width: 32,
				depth: 32,
			})

			for (let i = 0; i < snakeArray.length; i++) {
				if (snakeArray[snakeArray.length - 1].material != foodMaterial) {
					snakeArray[snakeArray.length - 1].material = snakeCellMaterial
					snakeArray[snakeArray.length - 1].scaling = new BABYLON.Vector3(
						1,
						0.875,
						1
					)
					snakeArray[snakeArray.length - 1].position.y = -2
				}
			}

			snakeCell.material = snakeHeadMaterial
			shadow.getShadowMap().renderList.push(snakeCell)

			snakeCell.position.x = snake.posX
			snakeCell.position.z = snake.posZ
			snakeArray.push(snakeCell)
			snake.Last = Date.now()
		}

		if (snakeArray.length > snake.Length) {
			scene.removeMesh(snakeArray[0])
			snakeArray[0].dispose()
			snakeArray.shift()
		}

		window.addEventListener('keydown', control)
		function control(event) {
			const key = event.key
			var dir
			if ((key == 'ArrowUp' || key == 'w' || key == 'ц') && dir !== 'Down') {
				dir = 'Up'
				snake.dirZ = tile
				snake.dirX = 0
			} else if (
				(key == 'ArrowDown' || key == 's' || key == 'ы') &&
				dir !== 'Up'
			) {
				dir = 'Down'
				snake.dirZ = -tile
				snake.dirX = 0
			} else if (
				(key == 'ArrowLeft' || key == 'a' || key == 'ф') &&
				dir !== 'Right'
			) {
				dir = 'Left'
				snake.dirX = -tile
				snake.dirZ = 0
			} else if (
				(key == 'ArrowRight' || key == 'd' || key == 'в') &&
				dir !== 'Left'
			) {
				dir = 'Right'
				snake.dirX = tile
				snake.dirZ = 0
			} else if (key == 'r' || key == 'к') {
				snake.dirX = 0
				snake.dirZ = 0
			}
		}
	})
	scene.registerAfterRender(() => {
		if (
			snake.posX < 10.5 * tile &&
			snake.posX > -10.5 * tile &&
			snake.posZ < 10.5 * tile &&
			snake.posZ > -10.5 * tile
		) {
			if (food != null) {
				if (snakeArray[snakeArray.length - 1] != null) {
					if (food.position.x == snake.posX && food.position.z == snake.posZ) {
						snake.Length += 1
						score += 1

						snakeCell.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5)
						snakeArray[snakeArray.length - 1].material = foodMaterial
						snakeCell.material = foodMaterial

						food != null
						food.position.x = getFoodPosition().x
						food.position.z = getFoodPosition().z

						if (score >= 5 && score <= 20) {
							speed = 125
						} else if (score >= 20) {
							speed = 100
						} else {
							speed = 150
						}
					}
				}
			} else {
				for (var i = 0; i < snakeArray.length; i++)
					setTimeout(() => {
						removeMesh(snakeArray[i])
					}, 100)
			}
		} else {
			//window.location.reload()
			snake.posX = 0
			snake.posZ = 0
			snake.dirX = 0
			snake.dirZ = 0
			snake.Length = 1
			snake.Last = 0
			score = 0
			speed = 150
		}

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
