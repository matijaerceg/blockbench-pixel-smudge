/* Pixel Smudge 0.1.1 — MIT */
(function(){
 'use strict';
 let tool,strength,pickup,bag=new Map();
 const ids=['pixel_smudge_tool','pixel_smudge_strength','pixel_smudge_pickup'];
 function removeOldControls(){
  if(ids.includes(Toolbox.selected?.id))BarItems.brush_tool.select();
  const stale=new Set(ids.map(id=>BarItems[id]).filter(Boolean));
  for(const t of Tool.all)if(ids.includes(t.id))stale.add(t);
  for(const bar of Object.values(Toolbars)){
   for(const item of bar.children||[])if(ids.includes(item?.id))stale.add(item);
   if(bar.postload)bar.postload=bar.postload.filter(entry=>!ids.includes(entry[0]));
   if(bar.children)bar.children=bar.children.filter(item=>!ids.includes(typeof item==='string'?item:item?.id));
  }
  for(const item of stale)item.delete();
  for(const bar of Object.values(Toolbars))if(bar.update)bar.update(true);
 }

 const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));
 // Mix premultiplied colors so transparent pixels cannot introduce black fringes.
 function mix(a,b,t){const alpha=a.a*(1-t)+b.a*t;const out={a:alpha};for(const c of ['r','g','b'])out[c]=alpha?(a[c]*a.a*(1-t)+b[c]*b.a*t)/alpha:0;return out}
 function changePixel(px,py,color,coverage,{x,y,texture}){
  const key=texture.uuid+':'+Math.round(px-x)+':'+Math.round(py-y),previous=bag.get(key);
  if(!previous){bag.set(key,{...color});return color}
  const amount=strength.get()/100*coverage;
  const result=mix(color,previous,amount);
  bag.set(key,mix(previous,color,pickup.get()/100*coverage));
  if(Painter.lock_alpha)result.a=color.a;
  return result;
 }
 Plugin.register('pixel_smudge',{title:'Pixel Smudge',author:'Misterzine',description:'Carry and mix texture pixels continuously while dragging. Active layer only; adjustable strength and pickup.',icon:'blur_on',version:'0.1.1',min_version:'5.2.0',variant:'both',
  onload(){
   removeOldControls();
   strength=new NumSlider('pixel_smudge_strength',{name:'Smudge strength',description:'How much carried color is applied at each pixel. Drag to adjust or click to type.',settings:{min:0,max:100,step:1,default:50},condition:()=>Toolbox.selected===tool,onChange(value){this.value=clamp(value)}});
   pickup=new NumSlider('pixel_smudge_pickup',{name:'Color pickup',description:'How quickly the brush picks up the pixels it crosses. Low values carry the starting color farther.',settings:{min:0,max:100,step:1,default:25},condition:()=>Toolbox.selected===tool,onChange(value){this.value=clamp(value)}});
   strength.setValue(50);pickup.setValue(25);
   tool=new Tool('pixel_smudge_tool',{name:'Pixel Smudge',description:'Drag to smear pixels on the active layer. Adjust Strength and Pickup in the top toolbar.',icon:'blur_on',category:'tools',toolbar:'brush',cursor:'crosshair',selectFace:true,transformerMode:'hidden',paintTool:true,modes:['paint'],allowed_view_modes:['textured','material'],
    brush:{size:true,shapes:true,softness:false,opacity:false,offset_even_radius:true,floor_coordinates:true,interval:1,line:false,screen_space:false,onStrokeStart(){bag.clear();if(Painter.mirror_painting){Blockbench.showQuickMessage('Turn off mirror painting before using Pixel Smudge.',3000);return false}},onStrokeEnd(){bag.clear()},changePixel},
    onCanvasClick(data){Painter.startPaintToolCanvas(data,data.event)},onSelect(){strength.update();pickup.update();Painter.updateNslideValues();Blockbench.showQuickMessage('Smudge edits the active layer. Strength applies color; Pickup collects it.',3500)},onUnselect(){bag.clear()}
   });
   Toolbars.tools.add(tool,1);Toolbars.brush.add(pickup,0);Toolbars.brush.add(strength,0);
  },
  onunload(){if(Toolbox.selected===tool)BarItems.brush_tool.select();bag.clear();tool.delete();strength.delete();pickup.delete()}
 });
})();

