/**
 * @author Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * 
 * Heavily inspired by LibGDX's WebGLMaskManager:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLMaskManager.java
 */

PIXI.WebGLMaskManager = function(gl)
{
    this.gl = gl;
    this.maskStack = [];
    this.maskPosition = 0;
}

PIXI.WebGLMaskManager.prototype.pushMask = function(maskData, projection)
{ 
    var gl = this.gl;

    if(this.maskStack.length === 0)
    {
        gl.enable(gl.STENCIL_TEST);
        gl.stencilFunc(gl.ALWAYS,1,1);
    }
    
    this.maskStack.push(maskData);
    
    gl.colorMask(false, false, false, false);
    gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);

    PIXI.WebGLGraphics.renderGraphics(maskData, projection);

    gl.colorMask(true, true, true, true);
    gl.stencilFunc(gl.NOTEQUAL,0, this.maskStack.length);
    gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
}

PIXI.WebGLMaskManager.prototype.popMask = function(projection)
{ 
    var gl = this.gl;

    var maskData = this.maskStack.pop();

    if(maskData)
    {
        gl.colorMask(false, false, false, false);

        //gl.stencilFunc(gl.ALWAYS,1,1);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);

        PIXI.WebGLGraphics.renderGraphics(maskData, projection);

        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.NOTEQUAL,0,this.maskStack.length);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
    }
   
    if(this.maskStack.length === 0)gl.disable(gl.STENCIL_TEST);
}