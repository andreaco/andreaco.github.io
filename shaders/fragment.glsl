#define PI 3.14159265359
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float noise(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec3 uv) {
    return fract(sin(dot(uv, vec3(12.9898,78.233, 45.543))) * 43758.5453);
}

float ValueNoise2D(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    f = f * f * (3.0 - 2.0 * f);

    float a = noise(i + vec2(0.0, 0.0));
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float ValueNoise3D(vec3 uv) {
    vec3 i = floor(uv);
    vec3 f = fract(uv);
    f = f * f * (3.0 - 2.0 * f);

    float a = noise(i + vec3(0.0, 0.0, 0.0));
    float b = noise(i + vec3(1.0, 0.0, 0.0));
    float c = noise(i + vec3(0.0, 1.0, 0.0));
    float d = noise(i + vec3(1.0, 1.0, 0.0));
    float e = noise(i + vec3(0.0, 0.0, 1.0));
    float f1 = noise(i + vec3(1.0, 0.0, 1.0));
    float g = noise(i + vec3(0.0, 1.0, 1.0));
    float h = noise(i + vec3(1.0, 1.0, 1.0));

    return mix(
        mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
        mix(mix(e, f1, f.x), mix(g, h, f.x), f.y),
        f.z
    );
}

#define OCTAVES 5
float fBm(vec2 uv, float lacunarity, float gain) {
    float sum = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < OCTAVES; i++) {
        sum += amp * ValueNoise2D(uv * freq);
        amp *= gain;
        freq *= lacunarity;
    }
    return sum;
}

float fBm(vec3 uv, float lacunarity, float gain) {
    float sum = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < OCTAVES; i++) {
        sum += amp * ValueNoise3D(uv * freq);
        amp *= gain;
        freq *= lacunarity;
    }
    return sum;
}

float TriangleSDF(vec2 uv, vec2 p0, vec2 p1, vec2 p2) {
    return length(max(abs(uv - p0), max(abs(uv - p1), abs(uv - p2))));
}

float sdEquilateralTriangle( in vec2 p, in float r )
{
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}

float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float sdRhombus( in vec2 p, in vec2 b ) 
{
    p = abs(p);
    float h = clamp( ndot(b-2.0*p,b)/dot(b,b), -1.0, 1.0 );
    float d = length( p-0.5*b*vec2(1.0-h,1.0+h) );
    return d * sign( p.x*b.y + p.y*b.x - b.x*b.y );
}

float remap(float value, float low1, float high1, float low2, float high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

float GlowingCircles(vec2 uv_noise, vec2 mouse) {
    float radius = length(uv_noise);

    float circle = 0.;
    const int n = 3;
    for (int i=0; i < n; i++) {
        
        float mouse_ease = remap((sin(0.5*mouse.y*PI)), 0., 1., 1.6, 1.4);
        float size = mouse_ease * float(i + 1) / float(n);


        float ray  = abs( length(uv_noise / size) - .55);
        circle += 1. - smoothstep(0., 0.0055, ray);

        float glow = 0.2/ (radius-0.06) * (1. - smoothstep(0.0, 0.035, ray ));
        circle += 0.2 * glow;
    }
    return circle;
}
void main () {
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution) / min(u_resolution.x, u_resolution.y);
    vec2 uv_noise = uv;
    vec2 noise_coords = vec2((uv_noise.x), (uv_noise.y));
    vec2 mouse = u_mouse /  u_resolution;

    float angle = atan(uv_noise.y, uv_noise.x);
    float radius = length(uv_noise);
    
    float noise_disp =  0.03 * 0.5 * (1.+fBm(noise_coords.yx * 35. + u_time, 2., 0.5));
    uv_noise += (radius-0.1) * noise_disp;
    
    float circle = GlowingCircles(uv_noise, mouse + sin(0.5*u_time));
    float bg_circles = GlowingCircles(1.1*uv_noise, 0.5*mouse);
    float rhomb1 = 0.;
    float rhomb2 = 0.;
        for (int i=0; i < 3; ++i) {
            
        float scale = float(i+1);
        float r1 = sdRhombus(scale*uv_noise, vec2(0.55, 0.2));
        float r2 = sdRhombus(scale*uv_noise.yx, vec2(0.55, 0.2));
        
        rhomb1 += 1.-smoothstep(0.0, 0.005, r1*r2);
        // rhomb2 += 1.-smoothstep(0.0, 0.005, r2);
    };



    vec3 col = vec3(0.1*bg_circles + rhomb1 * circle + 0.1*fBm(vec3(uv, 0.1*u_time),3., 0.5));

    gl_FragColor = vec4(col, 1.0);   
}