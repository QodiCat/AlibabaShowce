import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizePage,adjacentPage,isLastPage,swipeDirection,turnFrames} from '../public/reader.js';

test('mobile visits every page and returns to the cover',()=>{
 let page=0;const visited=[];for(let i=0;i<13;i++){visited.push(page);page=adjacentPage(page,1,12,true);}
 assert.deepEqual(visited,Array.from({length:13},(_,i)=>i));assert.equal(page,12);
 for(let i=0;i<12;i++)page=adjacentPage(page,-1,12,true);assert.equal(page,0);
});
test('desktop spreads never skip or repeat the last content page',()=>{
 let page=0;const visited=[];for(let i=0;i<7;i++){visited.push(page);page=adjacentPage(page,1,12,false);}
 assert.deepEqual(visited,[0,1,3,5,7,9,11]);assert.equal(page,11);assert.equal(isLastPage(11,12,false),true);
 assert.equal(adjacentPage(11,-1,12,false),9);assert.equal(adjacentPage(1,-1,12,false),0);
 assert.equal(normalizePage(12,12,false),11);assert.equal(normalizePage(6,12,false),5);
 assert.equal(isLastPage(11,12,true),false);assert.equal(adjacentPage(0,1,0,false),0);
});
test('touch gestures distinguish horizontal turns from vertical scrolling and taps',()=>{
 assert.equal(swipeDirection(-90,10,390),1);assert.equal(swipeDirection(90,10,390),-1);
 assert.equal(swipeDirection(60,100,390),0);assert.equal(swipeDirection(5,2,390),0);
 assert.equal(swipeDirection(35,0,320),0);assert.equal(swipeDirection(-50,0,320),1);
});
test('page turn keyframes rotate in opposite directions around the hinge',()=>{
 assert.match(turnFrames(1)[2].transform,/-170/);assert.match(turnFrames(-1)[2].transform,/\(170/);
 assert.equal(turnFrames(1)[0].opacity,1);assert.equal(turnFrames(1)[2].opacity,0);
});
