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
    name: "topLine",
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
let interval=null;

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

            interval=setInterval(()=>{
                if (currentBody.position.x-currentFruit.radius>30)
                    Body.setPosition(currentBody,{
                        x: currentBody.position.x-1,
                        y: currentBody.position.y,
                    });
            },5)
            break;

        case "ArrowRight":
            interval=setInterval(()=>{
                if (currentBody.position.x-currentFruit.radius>30)
                    Body.setPosition(currentBody,{
                        x: currentBody.position.x+1,
                        y: currentBody.position.y,
                    });
            },5)
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

window.onkeyup=(event)=>{{
    switch (event.code){
        case "ArrowRight":
        case "ArrowLeft":
            clearInterval(interval);
            interval=null;
    }
}}



Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) {
            const index=collision.bodyA.index;

            if (index===FRUITS_HLW.length-1) return;        // ===: ==에 비해 엄격한 비교 - 형변환을 시도한 뒤 비교함

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

        if(!disableAction&&(
            collision.bodyA.name==="topLine" || collision.bodyB.name==="topLine")) alert("Game Over!");
        
    });
});

addFruit();
