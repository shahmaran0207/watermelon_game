import { Body, Bodies, Engine, Render, Runner, World, Events } from "matter-js";
import { FRUITS_HLW } from "./fruits.js";

const engine = Engine.create();
const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850,
    }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic: true,
    isSensor: true,
    render: { fillStyle: "#E6B143" }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;

function addFruit() {
    const index = Math.floor(Math.random() * 5);
    const fruit = FRUITS_HLW[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true,
        render: {
            sprite: { texture: `${fruit.name}.png` }        //이미지 텍스처를 적용하기 위해 사용
        },
        restitution: 0.35, // 탄성 0~1 사이
    });

    currentBody = body;
    currentFruit = fruit;

    World.add(world, body);
}

window.onkeydown = (event) => {
    if (disableAction) return;

    const { x, y } = currentBody.position;
    const radius = currentFruit.radius;

    switch (event.code) {
        case "ArrowLeft":
            if (x - radius > 30) {
                Body.setPosition(currentBody, { x: x - 10, y });
            }
            break;

        case "ArrowRight":
            if (x + radius < 590) {
                Body.setPosition(currentBody, { x: x + 10, y });
            }
            break;

        case "ArrowDown":
            currentBody.isSleeping = false;
            disableAction = true;

            setTimeout(() => {
                addFruit();
                disableAction = false;
            }, 1500);
            break;
    }
};

Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) {
            const index=collision.bodyA.index;

            if (index===FRUITS_HLW.length-1) return;

            World.remove(world, [collision.bodyA, collision.bodyB]);

            const newFruit=FRUITS_HLW[index+1];

            const newBody=Bodies.circle(
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    render: {
                        sprite: { texture: `${newFruit.name}.png` }        //이미지 텍스처를 적용하기 위해 사용
                    },
                    index: index+1,
                }
            );

            World.add(world, newBody);
        }
    });
});

addFruit();
