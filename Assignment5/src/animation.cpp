#include "renderer.h"
#include <iostream>
#include <string>
#include <algorithm>
#include <cmath>

using namespace std;

struct Scene transform(float percentage, struct Scene scene) {
    const glm::vec3 transl1 = glm::vec3(12,0,0);
    const glm::vec3 transl2 = glm::vec3(0,5,0);
    const glm::vec3 rotat1 = glm::vec3(0,180,0);
    const glm::vec3 rotat2 = glm::vec3(0,160,0);
    const glm::vec3 scale2 = glm::vec3(0,2,0);

    const glm::vec3 transl3 = glm::vec3(14,0,14);

    scene.objects.at(2)->setTransformation(genTRMat(glm::vec3(-6,4,23)+transl1*percentage,glm::vec3(0.0)+rotat1*percentage,glm::vec3(7.0f)));
    scene.objects.at(3)->setTransformation(genTRMat(glm::vec3(-6,0.0,16)+transl2*percentage,glm::vec3(0.0)+rotat2*percentage,glm::vec3(3.0f)+scale2*percentage));
        
    scene.lights.at(1)->position = glm::vec3(0.0, 3.0, 12.0) + transl3*percentage;

    return scene;
}

string padStart(char pad, int number, string str) {
    return std::string(number - min(number, int(str.length())), pad) + str;
}

int main(int argc, char const *argv[]) {
    const int frames = 120;
    const int pad = log10(frames)+1;

    struct Scene scene = sceneDefinition();
    int number = 0;

    int i;
    for (i = 0; i < frames/2; i++,number++) {
        const float percentage = (i/(float)frames)*2.0;
        cout << endl << number/(float)frames*100.0 << "%\nAnimating:"<<percentage*100 << endl;

        string filename ("render/animation/render_"+padStart('0',pad,to_string(number))+".ppm");
        render(transform(percentage, scene), filename);
    }
    for (i = frames/2; i >= 0; i--,number++) {
        const float percentage = (i/(float)frames)*2.0;
        cout << endl << number/(float)frames*100.0 << "%\nAnimating:"<<percentage*100 << endl;

        string filename ("render/animation/render_"+padStart('0',pad,to_string(number))+".ppm");
        render(transform(percentage, scene), filename);
    }
}