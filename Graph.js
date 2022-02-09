class Node {
    constructor(val) {
        this.value = val;
        this.antecedent = [];
    }
    getValue() {
        return this.value;
    }
    setAntecedent(antecedent) {
        this.antecedent.push(antecedent);
    }
    getAntecedent() {
        return this.antecedent;
    }
}

class Graph {
    constructor() {
        this.node = [];
        this.constructionNodeSet = null
        this.constructionLinkSet = null
        this.itineraireList = []
    }

    getNodes(){
        return this.node
    }

    fromArray(gares, links) {
        for (var i = 0; i < gares.length; i++) {
            this.node.push(new Node(gares[i]));
        }
        for (var departIndex = 0; departIndex < links.length; departIndex++) {
            var departNode = this.findNode(links[departIndex].depart);
            var directions = links[departIndex].direction;
            for (
                var arriveeIndex = 0; arriveeIndex < directions.length; arriveeIndex++
            ) {
                var arriveeNode = this.findNode(directions[arriveeIndex]);
                departNode.setAntecedent(arriveeNode);
            }
        }
        this.constructionNodeSet = gares
        this.constructionLinkSet = links
    }

    fromMatrix(matrix) {
        var alphabet = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
        ];
        var num_rows = matrix.length;
        var num_cols = matrix.length;
        for (var i = 0; i < num_rows; i++) {
            var alphabetLetter = alphabet[i];
            this.node.push(new Node(alphabetLetter));
        }
        for (var rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
            var row = matrix[rowIndex];
            var rowLetter = alphabet[rowIndex];
            var nodeRow = this.findNode(rowLetter);
            for (
                var antecedentIndex = 0; antecedentIndex < row.length; antecedentIndex++
            ) {
                var antecedent = matrix[rowIndex][antecedentIndex];
                var antecedentLetter = alphabet[antecedentIndex];
                var antecedentNodeRow = this.findNode(antecedentLetter);
                if (antecedent == 1) {
                    nodeRow.setAntecedent(antecedentNodeRow);
                }
            }
        }
    }

    getMatrix() {
        var laMatrice = [];
        var tailleMatrice = this.node.length
        for (var row = 0; row < tailleMatrice; row++) {
            var laLigne = [];
            var antecedents = this.node[row].getAntecedent()
            for (var col = 0; col < tailleMatrice; col++) {
                var colNode = this.node[col]
                if (antecedents.indexOf(colNode) != -1) {
                    laLigne.push(1);
                } else {
                    laLigne.push(0);
                }
            }
            laMatrice.push(laLigne);
        }
        return laMatrice
    }

    cheminPossibleVers(depart, arrivee) {
        var resParcours = this.parcoursProfondeur(depart)
        var destinations = (resParcours != undefined) ? resParcours : []
        console.log("Depart '" + depart + "' arrivée '" + arrivee + "'")
        console.log("Destinations = " + destinations)
        if (destinations.includes(arrivee)) {
            console.log("Possible")
            return true
        } else {
            console.log("Pas Possible")
            return false
        }
    }

    creerItineraire(depart, arrivee) {
        // Si chemin possible
        if(this.cheminPossibleVers(depart, arrivee)){
            //console.log("DEPART PARCOURS")
            var dejaVu = []
            this.itineraireList = []
            this._itineraire(depart, arrivee, dejaVu)
            this.itineraireList.reverse()
            this.itineraireList.unshift(depart)
            this.itineraireList.push(arrivee)
            //console.log("itineraireList = "+this.itineraireList)
            return this.itineraireList
        }else{
            return ["<span style='color:red'>Itineraire impossible</span>"]
        }
    }

    _itineraire(startPoint, arrivee, dejaVu) {
        var node = this.findNode(startPoint)
        dejaVu.push(node.getValue())
        var antecedentList = node.getAntecedent()
        for (var i = 0; i < antecedentList.length; i++) {
            var nodeEnfant = antecedentList[i]  
            if(nodeEnfant.getValue() != arrivee){
                if (dejaVu.indexOf(nodeEnfant.getValue()) == -1) {
                    var trouve = this._itineraire(nodeEnfant.getValue(), arrivee, dejaVu)
                    if(trouve != false){
                        this.itineraireList.push(nodeEnfant.getValue())
                       return true
                    }
                }
            }else{
                return true
            }
        }
        return false
    }

    dijkstra(depart, arrivee){
        // Si chemin possible
        if(this.cheminPossibleVers(depart, arrivee)){
            var noeuds = this.getNodes()
            console.log("noeuds = "+noeuds)
            console.log(noeuds)
            var noeudDijkstra = new Object();
    
            for(var i = 0 ; i < noeuds.length ; i++){
                noeudDijkstra[noeuds[i].getValue()] = {
                    nom : noeuds[i].getValue(),
                    visited : false,
                    distance : Infinity,
                    bestParent : null
                }
            }
            noeudDijkstra[depart].distance = 0
    
            noeudDijkstra = this._dijkstra(depart, arrivee, noeudDijkstra)
            console.log("Resultat final dijkstra = ")
            debugDijkstra(noeudDijkstra)
    
            // Traiter resultats
            var itiniraireTermine = false
            var itineraire = []
            var noeudNom = arrivee;
            while(!itiniraireTermine){ 
                //console.log("NoeudNom = "+noeudNom)
                var bonParent = noeudDijkstra[noeudNom].bestParent
                noeudNom = bonParent
                itineraire.push(noeudNom)
                if(noeudNom == depart){
                    itiniraireTermine = true
                }
            }
            console.log("Itineraire = ")
            console.log(itineraire)
            itineraire.reverse()
            itineraire.push(arrivee)
            return itineraire
        }else{
            return ["<span style='color:red'>Itineraire impossible</span>"]
        }
    }

    _dijkstra(depart, arrivee, noeudDijkstra){
        var node = this.findNode(depart)
        var nomNode = node.getValue()
        var enfants = node.getAntecedent()
        noeudDijkstra[nomNode].visited = true

        // Pour chaque enfants
        for (let i = 0; i < enfants.length; i++) {
            var enfantNom = enfants[i].getValue()
            // Parametres actuels de l'enfant
            var enfantVisited = noeudDijkstra[enfantNom].visited
            var enfantDistanceToDepart = noeudDijkstra[enfantNom].distance
            // Parametres actuels du noeud courant
            var noeudDistanceToDepart = noeudDijkstra[nomNode].distance

            // Assigner le meilleur itineraire a chaque enfant
            if(enfantDistanceToDepart == Infinity){
                // Ajouter le noeud actuel comme chemin vers le depart
                noeudDijkstra[enfantNom].distance = noeudDistanceToDepart+1
                noeudDijkstra[enfantNom].bestParent = nomNode
            }else{
                var distanceFromEnfantToDepart = noeudDistanceToDepart+1
                // Si le trajet est mieux que le trajet actuel sur l'enfant
                if(distanceFromEnfantToDepart < enfantDistanceToDepart){
                    noeudDijkstra[enfantNom].distance = noeudDistanceToDepart+1
                    noeudDijkstra[enfantNom].bestParent = nomNode
                }
            }
        }
        for (var i = 0; i < enfants.length; i++) {
            var enfantNom = enfants[i].getValue()
            var enfantVisited = noeudDijkstra[enfantNom].visited

            // Si l'enfant a pas déja été visité
            if(!enfantVisited){
                // Faire pareil pour chaque noeuds enfant
                this._dijkstra(enfantNom, arrivee, noeudDijkstra)
            }
        }
        return noeudDijkstra
    }


    parcoursProfondeur(startPoint) {
        console.log("DEPART PARCOURS")
        var dejaVu = []
            //console.log(this._parcoursProfondeur(startPoint, dejaVu))
        return this._parcoursProfondeur(startPoint, dejaVu)
    }

    _parcoursProfondeur(startPoint, dejaVu) {
        var node = this.findNode(startPoint)
        dejaVu.push(node.getValue())
        var antecedentList = node.getAntecedent()
        for (var i = 0; i < antecedentList.length; i++) {
            //console.log("Prochain : " + antecedentList[i].getValue())
            //console.log("dejaVu : " + dejaVu)
            if (dejaVu.indexOf(antecedentList[i].getValue()) == -1) {
                this._parcoursProfondeur(antecedentList[i].getValue(), dejaVu)
            }
        }
        return dejaVu
    }

    findNode(value) {
        for (
            var currentNodeIndex = 0; currentNodeIndex < this.node.length; currentNodeIndex++
        ) {
            var currentNode = this.node[currentNodeIndex];
            if (currentNode.getValue() == value) {
                return currentNode;
            }
        }
    }

    showDegre(value) {
        var noeud = this.findNode(value);
        var degre = noeud.getAntecedent().length;
        return "Degre de " + value + " : " + degre;
    }
    show() {
        for (var noeudIndex = 0; noeudIndex < this.node.length; noeudIndex++) {
            var noeud = this.node[noeudIndex];
            var nodeVal = noeud.getValue();
            var nodeAntecedents = noeud.getAntecedent();
            //console.log(nodeVal);
            for (
                var antecedentsIndex = 0; antecedentsIndex < nodeAntecedents.length; antecedentsIndex++
            ) {
                var antecedents = nodeAntecedents[antecedentsIndex];
                //console.log(" ↳ " + antecedents.getValue());
            }
        }
    }
    createSVGfromGraph() {
        var newNodes = [];
        var newLinks = [];
        for (var noeudIndex = 0; noeudIndex < this.node.length; noeudIndex++) {
            var noeud = this.node[noeudIndex];
            var nodeVal = noeud.getValue();
            var nodeAntecedents = noeud.getAntecedent();
            var nodeJson = {
                id: nodeVal,
                reflexive: false,
            };
            nodeJson.x = 0;
            nodeJson.y = 0;
            newNodes.push(nodeJson);
        }

        for (var noeudIndex = 0; noeudIndex < this.node.length; noeudIndex++) {
            var noeud = this.node[noeudIndex];
            var nodeVal = noeud.getValue();
            var nodeAntecedents = noeud.getAntecedent();
            for (
                var antecedentsIndex = 0; antecedentsIndex < nodeAntecedents.length; antecedentsIndex++
            ) {
                var antecedents = nodeAntecedents[antecedentsIndex];
                // Récupération de l'index du noeux enfant dans le graph
                for (
                    var currentNodeIndex = 0; currentNodeIndex < this.node.length; currentNodeIndex++
                ) {
                    var currentNode = this.node[currentNodeIndex];
                    if (currentNode.getValue() == antecedents.getValue()) {
                        var antecedentID = currentNodeIndex;
                    }
                }
                var idLink = newNodes[noeudIndex].id+"-TO-"+newNodes[antecedentID].id
                idLink = idLink.toLowerCase().replace(" ","_")
                idLink = idLink.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                newLinks.push({
                    source: newNodes[noeudIndex],
                    target: newNodes[antecedentID],
                    left: false,
                    right: true,
                    data: idLink,
                    value: 1,
                });
            }
        }
        // Remplir datalist
        $("#datalistGares").html("")
        var nodesList = this.getNodes()
        for(var i = 0 ; i < nodesList.length ; i++ ){
            $("#datalistGares").html($("#datalistGares").html()+"<option value='"+nodesList[i].getValue()+"'>")
        }
        createSVG(newNodes, newLinks);
    }
}

function debugDijkstra(array, debugFull = false){
    /* DEBUG */
    console.log("------------------------------------------------------------")
    console.log("Noeuds dijkstra = ")
    console.log(array)
    if(debugFull){
        for (var i in array) {
            console.log(i)
            console.log(" Visited "+array[i].visited)
            console.log(" Distance "+array[i].distance)
            console.log(" BestParam "+array[i].bestParent)
            
        }
    }
    console.log("------------------------------------------------------------")
    /* FIN DEBUG */
}

function createGare() {
    var gares = [
        "Vaise",
        "Valmy",
        "Gorge de loup",
        "Vieux lyon",
        "Bellecour",
        "Guillotière",
        "Saxe-gambetta",
        "Garibaldi",
        "Sans-souci",
        "Monplaisir-lumière",
        "Perrache",
        "Ampère",
        "Cordeliers",
        "Hotel de ville",
        "Foch",
        "Massena",
        "Charpennes",
        "République",
        "Brotteaux",
        "Part-dieu",
        "Place guichard",
        "Jean macé",
        //"Jean jaures",
     ];
     // Links Simplifiés
    var links = [{
            depart: "Vaise",
            direction: ["Valmy"],
        },
        {
            depart: "Valmy",
            direction: ["Gorge de loup"],
        },
        {
            depart: "Gorge de loup",
            direction: ["Vieux lyon"],
        },
        {
            depart: "Vieux lyon",
            direction: ["Bellecour"],
        },
        {
            depart: "Bellecour",
            direction: ["Cordeliers","Guillotière"],
        },
        {
            depart: "Guillotière",
            direction: ["Saxe-gambetta", "Bellecour"],
        },
        {
            depart: "Saxe-gambetta",
            direction: ["Garibaldi", "Guillotière"],
        },
        {
            depart: "Garibaldi",
            direction: ["Sans-souci"],
        },
        {
            depart: "Sans-souci",
            direction: ["Garibaldi","Monplaisir-lumière"],
        },
        {
            depart: "Monplaisir-lumière",
            direction: ["Sans-souci"],
        },
        {
            depart: "Ampère",
            direction: ["Bellecour","Perrache"],
        },
        {
            depart: "Perrache",
            direction: ["Ampère"],
        },
        {
            depart: "Cordeliers",
            direction: ["Hotel de ville"],
        },
        {
            depart: "Hotel de ville",
            direction: ["Foch"],
        },
        {
            depart: "Foch",
            direction: ["Hotel de ville","Massena"],
        },
        {
            depart: "Massena",
            direction: ["Foch","Charpennes"],
        },
        {
            depart: "Charpennes",
            direction: ["République","Brotteaux"],
        },
        {
            depart: "République",
            direction: [],
        },
        {
            depart: "Brotteaux",
            direction: ["Part-dieu"],
        },
        {
            depart: "Part-dieu",
            direction: ["Place guichard"],
        },
        {
            depart: "Place guichard",
            direction: ["Saxe-gambetta"],
        },
        {
            depart: "Jean macé",
            direction: ["Saxe-gambetta"],
        },
    ];

    var graph = new Graph();
    graph.fromArray(gares, links);
    return graph;
}