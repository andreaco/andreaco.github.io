#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define MAX_STEPS 20
#define MAX_DIST 30.0
#define SURF_DIST 0.01

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// Removed unused voronoise functions for better performance

float sdGyroid(vec3 p, float scale) {
    // Fractal distortion with harmonics for natural rock-like appearance
    vec3 q = p;
    
    // First octave - large features
    q += sin(p.yzx * 2.0) * 0.15;
    
    // Second octave - medium features
    q += sin(p.zxy * 4.0 + 1.3) * 0.08;
    
    // Third octave - fine details
    q += sin(p.xyz * 8.0 + 2.7) * 0.04;
    
    // Fourth octave - very fine texture
    q += sin(p.yxz * 16.0 + 4.1) * 0.02;
    
    q *= scale;
    return abs(dot(sin(q), cos(q.zxy))) / scale - 0.3;
}

float hollowGyroid(vec3 p, float scale1, float scale2) {
    float gyroidDist1 = sdGyroid(p, scale1);
    float gyroidDist2 = sdGyroid(p, scale2);
    return gyroidDist1;max(gyroidDist1, -gyroidDist2);
}

// Removed unused affectGyroid function

float getDist(vec3 p) {
    // Shift gyroid backwards to create forward movement effect
    vec3 shiftedP = p + vec3(0, 0., u_time * 0.1);
    
    // Intersect two gyroids with different scales for organic blocks
    float gyroid1 = sdGyroid(shiftedP, 0.9);
    float gyroid2 = sdGyroid(shiftedP + vec3(0.5, 0.7, 0.3), 0.6); // Offset and different scale
    
    // Create organic blocks by intersecting the two gyroids
    float affectedGyroid = max(gyroid1, gyroid2);

    // Create organically twisted tube with fractal harmonics
    vec2 tubePos = p.xy;
    
    // First octave - large sweeping curves
    tubePos += vec2(sin(p.z * 0.3), cos(p.z * 0.4)) * 0.6;
    
    // Second octave - medium bends
    tubePos += vec2(sin(p.z * 0.8 + 1.5), cos(p.z * 1.1 + 2.1)) * 0.15;
    
    // Third octave - fine wiggles
    tubePos += vec2(sin(p.z * 2.0 + 3.7), cos(p.z * 2.3 + 4.9)) * 0.08;
    
    // Fourth octave - micro variations
    tubePos += vec2(sin(p.z * 5.0 + 6.2), cos(p.z * 4.7 + 7.8)) * 0.04;
    
    float tubeDist = length(tubePos) - 1.5;
    
    // Subtract tube from gyroid to create clear path
    float d = max(affectedGyroid, -tubeDist);
    return d;
}

float rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;
    
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        float dS = getDist(p);
        dO += dS;
        if (dO > MAX_DIST || dS < SURF_DIST) break;
    }
    
    return dO;
}

vec3 getNormal(vec3 p) {
    float d = getDist(p);
    vec2 e = vec2(0.01, 0);
    
    vec3 n = d - vec3(
        getDist(p - e.xyy),
        getDist(p - e.yxy),
        getDist(p - e.yyx)
    );
    
    return normalize(n);
}

float rockTexture(vec3 p) {
    // Fibrous, striated texture like microscopic carved material
    
    // Main fiber direction with fine parallel lines
    float fibers1 = abs(fract(p.y * 10.0) - 0.5) * 2.0;
    fibers1 = 1.0 - smoothstep(0.0, 0.3, fibers1);
    
    // Secondary fiber layer at slight angle
    float fibers2 = abs(fract((p.y + p.x * 0.2) * 20.0) - 0.5) * 2.0;
    fibers2 = 1.0 - smoothstep(0.0, 0.4, fibers2);
    
    // Fine scratches/incisions across fibers
    float scratches1 = abs(fract(p.x * 50.0) - 0.5) * 2.0;
    scratches1 = 1.0 - smoothstep(0.0, 0.2, scratches1);
    
    // Cross scratches for depth
    float scratches2 = abs(fract((p.x - p.y * 0.3) * 10.0) - 0.5) * 2.0;
    scratches2 = 1.0 - smoothstep(0.0, 0.15, scratches2);
    
    // Combine all elements with max for sharp incisive marks
    float texture = max(fibers1 * 0.6, max(fibers2 * 0.6, max(scratches1 * 0.8, scratches2 * 0.5)));
    
    return mix(0.6, 0.5, texture);
}

float getLight(vec3 p, vec3 lightPos, vec3 lightDir) {
    vec3 l = normalize(lightPos - p);
    vec3 n = getNormal(p);
    
    // Spotlight effect - light direction from camera
    float spotEffect = dot(l, -lightDir);
    spotEffect = smoothstep(0.7, 1.0, spotEffect); // Focus the beam
    
    float dif = clamp(dot(n, l), 0.0, 0.4);
    float d = rayMarch(p + n * SURF_DIST * 3.0, l);
    if (d < length(lightPos - p)) dif *= 0.1;
    
    return dif * spotEffect;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    vec3 col = vec3(0);
    
    // Mouse-controlled camera rotation with smooth drag
    vec2 mouse = (u_mouse / u_resolution.xy) * 2.0 - 1.0; // Normalize to -1 to 1
    
    // Very gentle drag effect - minimal sensitivity for smooth web experience
    mouse *= 0.4; // Much lower sensitivity
    mouse = mouse * (1.0 - 0.5 * exp(-length(mouse) * 1.5)); // Stronger ease-out
    
    float pitch = mouse.y * 3.14159 * 0.15; // Very limited vertical rotation
    float yaw = mouse.x * 3.14159 * 0.25;   // Very limited horizontal rotation
    
    // Camera position and direction
    vec3 ro = vec3(0.0, 0.0, 0);
    vec3 forward = vec3(sin(yaw) * cos(pitch), sin(pitch), cos(yaw) * cos(pitch));
    vec3 right = normalize(cross(forward, vec3(0, 1, 0)));
    vec3 up = cross(right, forward);
    vec3 rd = normalize(forward + uv.x * right + uv.y * up);
    
    float d = rayMarch(ro, rd);
    
    vec3 p = ro + rd * d;
    
    if (d < MAX_DIST) {
        float dif = getLight(p, ro, forward);
        
        // Apply texture using the same shifted position as the geometry
        vec3 shiftedTexP = p + vec3(0, 0., u_time * 0.1);
        float texture = rockTexture(shiftedTexP);
        
        // Distance-based fog/occlusion
        float fog = 1.0 - smoothstep(5.0, MAX_DIST, d);
        
        // Apply rock texture to the surface
        vec3 baseColor = vec3(texture) * (dif * 1.1 + 0.11);
        col = baseColor * fog;
    } else {
        // Far distance - just darkness
        col = vec3(0.0);
    }
    
    gl_FragColor = vec4(col, 1.0);
}
