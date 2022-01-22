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
        if (this.cheminPossibleVers(depart, arrivee)) {
            console.log("DEPART ITINERAIRE")
            var itineraire = []
            return this._creerItineraire(depart, arrivee, itineraire)
        } else {
            return ["Erreur, aucun itineraire est possible"]
        }
    }
    _creerItineraire(depart, arrivee, itineraire) {
        var node = this.findNode(depart)
        var arriveeNode = this.findNode(arrivee)
        itineraire.push(node.getValue())
        var antecedentList = node.getAntecedent()
        for (var i = 0; i < antecedentList.length; i++) {
            if (antecedentList[i].getValue() == arrivee) {
                console.log("----itineraire = " + itineraire)
                return itineraire
            }
            if (itineraire.indexOf(antecedentList[i].getValue()) == -1) {
                this._creerItineraire(antecedentList[i].getValue(), arrivee, itineraire)
            }
        }
        return itineraire
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
            console.log("Prochain : " + antecedentList[i].getValue())
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
            console.log(nodeVal);
            for (
                var antecedentsIndex = 0; antecedentsIndex < nodeAntecedents.length; antecedentsIndex++
            ) {
                var antecedents = nodeAntecedents[antecedentsIndex];
                console.log(" ↳ " + antecedents.getValue());
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
                newLinks.push({
                    source: newNodes[noeudIndex],
                    target: newNodes[antecedentID],
                    left: false,
                    right: true,
                    value: "",
                });
            }
        }
        console.log("newNodes");
        console.log(newNodes);
        createSVG(newNodes, newLinks);
    }
}

function createGare() {
    var gares = [
        "Paris",
        "Metz",
        "Lyon",
        "Marseille",
        "Brest",
        "Briançon",
        "Gap",
        "Toulon",
        "Bordeaux",
        "Nantes",
        "Rennes",
        "Dijon",
        "Valence",
        "Nice",
        "Limoges",
        "Reims",
        "Toulouse",
        "Montpellier",
    ];
    var links = [{
            depart: "Paris",
            direction: ["Lyon", "Nantes", "Reims", "Rennes", "Dijon"],
        },
        {
            depart: "Lyon",
            direction: ["Paris", "Marseille", "Bordeaux"],
        },
        {
            depart: "Marseille",
            direction: ["Lyon", "Montpellier", "Toulon"],
        },
        {
            depart: "Brest",
            direction: ["Rennes", "Nantes"],
        },
        {
            depart: "Briançon",
            direction: ["Gap"],
        },
        {
            depart: "Gap",
            direction: ["Valence"],
        },
        {
            depart: "Toulon",
            direction: ["Marseille", "Nice"],
        },
        {
            depart: "Bordeaux",
            direction: ["Toulouse", "Nantes"],
        },
        {
            depart: "Nantes",
            direction: ["Brest", "Rennes", "Paris", "Bordeaux"],
        },
        {
            depart: "Rennes",
            direction: ["Nantes", "Paris", "Brest"],
        },
        {
            depart: "Dijon",
            direction: ["Paris", "Lyon", "Metz"],
        },
        {
            depart: "Metz",
            direction: ["Reims", "Dijon"],
        },
        {
            depart: "Valence",
            direction: ["Montpellier", "Lyon"],
        },
        {
            depart: "Nice",
            direction: ["Toulon"],
        },
        {
            depart: "Limoges",
            direction: ["Nantes", "Toulouse", "Lyon"],
        },
        {
            depart: "Reims",
            direction: ["Paris", "Metz"],
        },
        {
            depart: "Toulouse",
            direction: ["Montpellier", "Bordeaux", "Limoges"],
        },
        {
            depart: "Montpellier",
            direction: ["Toulouse", "Marseille", "Lyon"],
        },
    ];

    var graph = new Graph();
    graph.fromArray(gares, links);
    return graph;
}