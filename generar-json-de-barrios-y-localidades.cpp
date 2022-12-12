// Primer programa de ejemplo en C++

#include <iostream>
#include <bits/stdc++.h>
/*
#include <sstream>
#include <fstream>
#include <string>
#include <vector>
*/

using namespace std;

// A quick way to split strings separated via any character
// delimiter.
void adv_tokenizer(string s)
{
    stringstream ss(s);
    string word;
    vector<string> arregloDeBarrios;
    while (!ss.eof()) {
        getline(ss, word, ",");
        cout << word << endl;
    }
}

int main ()
{
    map <string, string> localidadesYBarrios;
    while (getline(cin, linea))
    {
        if(!isdigit(linea[0])) continue; // Para la primera linea que cotiene el nombre de las columnas, y no la necesitamos
        istringstream iss(linea);
        string elemento;
        int iteracion = 0;
        getline(iss, elemento, '\t')
        getline(iss, elemento, '\t')
        getline(iss, elemento, '\t')
        string localidad = elemento.substr(elemento.find(" "));

        getline(iss, elemento, '\t')
        while(getline(iss, elemento, '\t')) // Separar por tabulado
        {
            if(iteracion < 2) continue;
            localidadesYBarrios.push_back(elemento);

            iteracion++;
            // do something with the line
        }
    }


    return 0;
}
