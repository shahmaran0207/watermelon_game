import { Body, Bodies, Engine, Render, Runner, World } from "matter-js";
import {FRUITS_HLW} from "./fruits.js";

const engine=Engine.create();
const render=Render.create({
    engine,
    element: document.body,
    options:{
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850,
    }
});

const world=engine.world;

const leftWall=Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: {fillStyle:"#E6B143"}
});

const rightWall=Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: {fillStyle:"#E6B143"}
});

const ground=Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: {fillStyle:"#E6B143"}
});

const topLine=Bodies.rectangle(310, 150, 620, 2, {
    isStatic: true,
    isSensor: true,
    render: {fillStyle:"#E6B143"}
});


World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentbBody=null;
let currentFruit=null;

function addFruit(){
    const index=Math.floor(Math.random()*5);
    const fruit=FRUITS_HLW[index];

    const body=Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true,       //사용자가 원하는 위치에 조정하기 전까지 대기시키는 것
        render: {
            sprite: {texture: `${fruit.name}.png`}
        },
        restitution: 0.3, //탄성  0~1 사이
    });

    currentbBody=body;
    currentFruit=fruit;

    World.add(world, body);
}

window.onkeydown=(event)=>{
    switch (event.code) {
        case "ArrowLeft":
            Body.setPosition(currentbBody,
                {
                    x: currentbBody.position.x-10,
                    y: currentbBody.position.y,
                });
            break;

        case "ArrowRight":
            Body.setPosition(currentbBody,
                {
                    x: currentbBody.position.x+10,
                    y: currentbBody.position.y,
                });
            break;

        case "ArrowDown":
            currentbBody.isSleeping=false;
            break;

    }
}

addFruit();