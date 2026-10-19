// HueHatch v0.6 original, dependency-free SVG scene data.
// Uses the same schema and safe SVG primitives as the initial four worlds.
const part = (tag,id,attrs,motion='') => ({tag,id,attrs,motion});
const path = (id,d,motion='') => part('path',id,{d},motion);
const rect = (id,x,y,width,height,rx=0,motion='') => part('rect',id,{x,y,width,height,rx},motion);
const circle = (id,cx,cy,r,motion='') => part('circle',id,{cx,cy,r},motion);
const ellipse = (id,cx,cy,rx,ry,motion='') => part('ellipse',id,{cx,cy,rx,ry},motion);

function dragonSkies() {
  const a=[
    rect('sky',0,0,900,620),
    circle('dragon-sun',743,115,70,'sun'),
    path('dragon-cloud-a','M40 173Q5 156 42 131Q59 93 109 109Q147 63 188 114Q248 100 255 155Q267 185 222 188H63Z','cloud'),
    path('dragon-cloud-b','M650 282Q603 262 634 226Q660 196 705 224Q747 181 790 227Q844 228 852 270Q854 300 803 304H679Z','cloud'),
    path('dragon-mountain-a','M0 474L164 272L325 463L463 321L633 465L762 317L900 468V620H0Z'),
    path('dragon-mountain-b','M0 553L170 433L351 548L527 415L747 548L900 429V620H0Z'),
    path('dragon-tail','M344 413Q225 433 198 354Q145 305 99 363Q117 439 173 475Q260 514 368 458Z','sway'),
    path('dragon-wing-back','M452 358Q399 204 324 164L336 265L255 205L298 330L260 344L370 403Z','flap'),
    path('dragon-leg-a','M384 444L347 519L367 550L406 547L421 496Z','bob'),
    path('dragon-leg-b','M533 442L550 530L590 546L623 531L586 455Z','bob'),
    path('dragon-body','M306 396Q355 307 462 321Q571 306 612 395Q645 482 552 504Q435 535 340 473Z','bob'),
    path('dragon-belly','M401 374Q461 346 519 373Q558 425 532 491Q476 512 417 471Z','bob'),
    path('dragon-wing-front','M475 357Q505 193 631 152L609 274L693 207L653 335L709 351L571 419Z','flap'),
    path('dragon-neck','M536 382Q550 289 626 258L682 320Q642 390 604 421Z','bob'),
    path('dragon-horn-a','M609 266L617 195L647 252Z','bob'),
    path('dragon-horn-b','M651 267L686 198L683 291Z','bob'),
    path('dragon-head','M603 288Q632 227 698 249Q749 262 754 317Q751 361 698 367L638 348Z','bob'),
    path('dragon-muzzle','M688 323Q757 290 792 338Q783 379 710 368Z','bob'),
    circle('dragon-eye',689,294,12,'bob'),
    circle('dragon-nostril',764,338,7,'bob'),
    path('dragon-flame','M788 326Q823 310 809 278Q846 305 838 337Q871 318 862 291Q907 351 859 380Q821 404 785 366Z','fire'),
    circle('dragon-spark-a',831,240,12,'sparkle'),
    circle('dragon-spark-b',877,262,9,'sparkle'),
    circle('dragon-spark-c',826,419,10,'sparkle')
  ];
  return a;
}

function enchantedForest() {
  const a=[
    rect('sky',0,0,900,620),
    circle('forest-moon',733,112,66,'bob'),
    path('forest-hill-back','M0 432Q239 302 440 421Q680 307 900 418V620H0Z'),
    path('forest-hill-front','M0 524Q242 435 480 517T900 493V620H0Z'),
    rect('forest-tree-trunk-a',133,270,71,278,15),
    rect('forest-tree-trunk-b',729,244,69,305,16),
    path('forest-tree-a','M172 70L301 319H256L334 411H24L95 318H58Z','sway'),
    path('forest-tree-b','M756 57L871 310H824L900 398H610L677 311H634Z','sway'),
    path('forest-pond','M278 547Q416 511 535 551Q613 577 555 605H303Q241 587 278 547Z','pulse'),
    path('forest-mushroom-stem-a','M332 469L332 558Q352 579 376 561L380 463Z','sway'),
    path('forest-mushroom-cap-a','M274 479Q285 372 355 371Q428 367 456 479Q373 508 274 479Z','sway'),
    circle('forest-mushroom-dot-a',339,434,19,'sway'),
    circle('forest-mushroom-dot-b',392,460,15,'sway'),
    path('forest-mushroom-stem-b','M578 474L582 559Q609 572 630 553L628 468Z','sway'),
    path('forest-mushroom-cap-b','M530 489Q541 408 606 405Q685 412 691 491Q619 515 530 489Z','sway'),
    circle('forest-mushroom-dot-c',605,454,18,'sway'),
    path('forest-crystal-a','M459 409L497 455L472 534L438 488Z','sparkle'),
    path('forest-crystal-b','M231 411L257 443L237 493L213 452Z','sparkle'),
    path('forest-crystal-c','M705 420L723 457L706 510L678 456Z','sparkle')
  ];
  for(const [i,x,y] of [[0,120,194],[1,346,175],[2,517,263],[3,684,193],[4,787,392],[5,407,340]]){
    a.push(circle('forest-firefly-'+i,x,y,13,'firefly'));
    a.push(circle('forest-glow-'+i,x+20,y-16,6,'firefly'));
  }
  return a;
}

function cosmicPlayground() {
  const a=[
    rect('sky',0,0,900,620),
    ellipse('space-planet-ring',718,168,162,37,'orbit'),
    circle('space-planet',717,165,103,'orbit'),
    circle('space-moon',167,152,62,'bob'),
    path('space-asteroid-a','M80 418L120 380L168 396L181 445L136 473L99 457Z','drift'),
    path('space-asteroid-b','M766 462L796 433L832 445L843 476L818 508L785 497Z','drift'),
    path('space-rocket-flame','M443 503Q469 554 447 599Q513 580 530 510Z','fire'),
    path('space-rocket-fin-left','M413 414L328 524L444 508Z','drift'),
    path('space-rocket-fin-right','M549 408L646 526L529 510Z','drift'),
    path('space-rocket-body','M453 470Q401 368 438 267Q471 178 485 153Q534 203 554 299Q582 410 518 473Z','drift'),
    path('space-rocket-nose','M438 278Q459 207 485 153Q519 201 538 281Z','drift'),
    circle('space-rocket-window',491,332,38,'drift'),
    circle('space-rocket-window-inner',491,332,22,'drift'),
    rect('space-rocket-thruster',460,466,52,53,12,'drift'),
    path('space-satellite-panel-left','M173 283L281 261L291 329L180 352Z','orbit'),
    path('space-satellite-panel-right','M353 247L463 230L473 300L367 318Z','orbit'),
    rect('space-satellite-core',286,252,78,72,11,'orbit'),
    circle('space-satellite-eye',326,288,17,'orbit'),
    path('space-comet','M708 350Q747 328 781 341Q752 367 738 404Q728 386 708 350Z','drift'),
    path('space-comet-tail','M705 352Q631 341 599 379Q628 323 701 322Z','drift')
  ];
  for(const [i,x,y] of [[0,84,79],[1,309,91],[2,591,87],[3,831,313],[4,181,530],[5,644,492],[6,864,94]]){
    a.push(path('space-star-'+i,`M${x} ${y-19}L${x+7} ${y-6}L${x+20} ${y}L${x+7} ${y+6}L${x} ${y+19}L${x-7} ${y+6}L${x-20} ${y}L${x-7} ${y-6}Z`,'sparkle'));
  }
  return a;
}

export const EXPANSION_SCENES = [
  {id:'dragon',name:'Dragon Skies',emoji:'🐉',hint:'Give your friendly dragon a rainbow flame',parts:dragonSkies()},
  {id:'forest',name:'Enchanted Forest',emoji:'🍄',hint:'Wake the fireflies and luminous mushrooms',parts:enchantedForest()},
  {id:'space',name:'Cosmic Playground',emoji:'🚀',hint:'Color a rocket, planets and orbiting stars',parts:cosmicPlayground()}
];
