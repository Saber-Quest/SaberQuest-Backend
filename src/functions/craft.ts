export function Craft(item1: string, item2: string): string {
    switch (item1) {
        case "ap": {
            switch (item2) {
                case "bp": return "bn"
                case "rcp": return "rn"
                case "bto": return "bsl"
                case "rto": return "rsl"
                default: return "none"
            }
        }
        case "bcn": {
            switch (item2) {
                default: return "none"
            }
        }
        case "bp": {
            switch (item2) {
                case "ap": return "bn"
                default: return "none"
            }
        }
        case "bd": {
            switch (item2) {
                default: return "none"
            }
        }
        case "bn": {
            switch (item2) {
                case "rn": return "dn"
                case "bn": return "bst"
                case "bst": return "bto"
                case "bs": return "bd"
                case "rs": return "bcn"
                case "sp": return "sn"
                default: return "none"
            }
        }
        case "bst": {
            switch (item2) {
                case "bn": return "bto"
                default: return "none"
            }
        }
        case "bs": {
            switch (item2) {
                case "bn": return "bd"
                case "rn": return "bcn"
                default: return "none"
            }
        }
        case "b": {
            switch (item2) {
                case "dn": return "br"
                default: return "none"
            }
        }
        case "bt": {
            switch (item2) {
                default: return "none"
            }
        }
        case "cw": {
            switch (item2) {
                default: return "none"
            }
        }
        case "ct": {
            switch (item2) {
                default: return "none"
            }
        }
        case "gn": {
            switch (item2) {
                default: return "none"
            }
        }
        case "gp": {
            switch (item2) {
                case "sn": return "gn"
                default: return "none"
            }
        }
        case "rcp": {
            switch (item2) {
                case "ap": return "rn"
                default: return "none"
            }
        }
        case "rn": {
            switch (item2) {
                case "bn": return "dn"
                case "rn": return "rst"
                case "rst": return "rto"
                case "rs": return "rd"
                case "bs": return "bcn"
                case "sp": return "sn"
                default: return "none"
            }
        }
        case "rst": {
            switch (item2) {
                case "rn": return "rto"
                default: return "none"
            }
        }
        case "st": {
            switch (item2) {
                default: return "none"
            }
        }
        case "sn": {
            switch (item2) {
                case "gp": return "gn"
                default: return "none"
            }
        }
        case "sp": {
            switch (item2) {
                case "bn": return "sn"
                case "rn": return "sn"
                default: return "none"
            }
        }
        case "w": {
            switch (item2) {
                default: return "none"
            }
        }
        case "rs": {
            switch (item2) {
                case "rn": return "rd"
                case "bn": return "bcn"
                default: return "none"
            }
        }
        case "115": {
            switch (item2) {
                default: return "none"
            }
        }
        case "bpp": {
            switch (item2) {
                default: return "none"
            }
        }
        case "rpp": {
            switch (item2) {
                default: return "none"
            }
        }
        case "bsl": {
            switch (item2) {
                case "bsl": return "bpp"
                default: return "none"
            }
        }
        case "rsl": {
            switch (item2) {
                case "rsl": return "rpp"
                default: return "none"
            }
        }
        case "bto": {
            switch (item2) {
                case "ap": return "bsl"
                default: return "none"
            }
        }
        case "rto": {
            switch (item2) {
                case "ap": return "rsl"
                default: return "none"
            }
        }
        case "bst": {
            switch (item2) {
                default: return "none"
            }
        }
        case "rst": {
            switch (item2) {
                default: return "none"
            }
        }
        case "bre": {
            switch (item2) {
                default: return "none"
            }
        }
        case "br": {
            switch (item2) {
                default: return "none"
            }
        }
        case "dn": {
            switch (item2) {
                case "b": return "br"
                default: return "none"
            }
        }
    }

    return "none"
}