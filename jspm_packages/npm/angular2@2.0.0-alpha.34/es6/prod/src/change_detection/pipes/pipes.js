/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { isBlank, isPresent, BaseException, CONST } from 'angular2/src/facade/lang';
import { Injectable, OptionalMetadata, SkipSelfMetadata } from 'angular2/di';
import { Binding } from 'angular2/di';
export let Pipes = class {
    constructor(config) {
        this.config = config;
    }
    get(type, obj, cdRef, existingPipe) {
        if (isPresent(existingPipe) && existingPipe.supports(obj))
            return existingPipe;
        if (isPresent(existingPipe))
            existingPipe.onDestroy();
        var factories = this._getListOfFactories(type, obj);
        var factory = this._getMatchingFactory(factories, type, obj);
        return factory.create(cdRef);
    }
    /**
     * Takes a {@link Pipes} config object and returns a binding used to extend the
     * inherited {@link Pipes} instance with the provided config and return a new
     * {@link Pipes} instance.
     *
     * If the provided config contains a key that is not yet present in the
     * inherited {@link Pipes}' config, a new {@link PipeFactory} list will be created
     * for that key. Otherwise, the provided config will be merged with the inherited
     * {@link Pipes} instance by prepending pipes to their respective keys, without mutating
     * the inherited {@link Pipes}.
     *
     * The following example shows how to extend an existing list of `async` factories
     * with a new {@link PipeFactory}, which will only be applied to the injector
     * for this component and its children. This step is all that's required to make a new
     * pipe available to this component's template.
     *
     * # Example
     *
     * ```
     * @Component({
     *   viewBindings: [
     *     Pipes.extend({
     *       async: [newAsyncPipe]
     *     })
     *   ]
     * })
     * ```
     */
    static extend(config) {
        return new Binding(Pipes, {
            toFactory: (pipes) => {
                if (isBlank(pipes)) {
                    // Typically would occur when calling Pipe.extend inside of dependencies passed to
                    // bootstrap(), which would override default pipes instead of extending them.
                    throw new BaseException('Cannot extend Pipes without a parent injector');
                }
                return Pipes.create(config, pipes);
            },
            // Dependency technically isn't optional, but we can provide a better error message this way.
            deps: [[Pipes, new SkipSelfMetadata(), new OptionalMetadata()]]
        });
    }
    static create(config, pipes = null) {
        if (isPresent(pipes)) {
            StringMapWrapper.forEach(pipes.config, (v, k) => {
                if (StringMapWrapper.contains(config, k)) {
                    var configFactories = config[k];
                    config[k] = configFactories.concat(v);
                }
                else {
                    config[k] = ListWrapper.clone(v);
                }
            });
        }
        return new Pipes(config);
    }
    _getListOfFactories(type, obj) {
        var listOfFactories = this.config[type];
        if (isBlank(listOfFactories)) {
            throw new BaseException(`Cannot find '${type}' pipe supporting object '${obj}'`);
        }
        return listOfFactories;
    }
    _getMatchingFactory(listOfFactories, type, obj) {
        var matchingFactory = ListWrapper.find(listOfFactories, pipeFactory => pipeFactory.supports(obj));
        if (isBlank(matchingFactory)) {
            throw new BaseException(`Cannot find '${type}' pipe supporting object '${obj}'`);
        }
        return matchingFactory;
    }
};
Pipes = __decorate([
    Injectable(),
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Pipes);
//# sourceMappingURL=pipes.js.map