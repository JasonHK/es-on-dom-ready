import { JSDOM } from "jsdom";
import Sinon, {
    SinonSpy,
    SinonStub,
} from "sinon";

import { onDomReady } from "../../src";

const { afterEach, beforeEach, suite, test } = intern.getPlugin("interface.tdd");
const { assert } = intern.getPlugin("chai");

suite(
    "unit/index.test.ts",
    () =>
    {
        suite(
            "onDomReady",
            () =>
            {
                let addEventListenerStub: AddEventListenerSpy;
                let callbackFake: SinonSpy<[], void>;
                
                beforeEach(
                    () =>
                    {
                        if (intern.environment === "node")
                        {
                            const jsdom = new JSDOM(undefined, { runScripts: "dangerously" });
                            global.Event = jsdom.window.Event;
                            global.document = jsdom.window.document;
                        }

                        addEventListenerStub = spyAddEventListener();
                        callbackFake = Sinon.fake() as SinonSpy<[], void>;
                    });

                afterEach(
                    () =>
                    {
                        Sinon.restore();

                        if (intern.environment === "node")
                        {
                            delete global.document;
                        }
                    });

                test(
                    "document.readyState is \"loading\"",
                    () =>
                    {
                        stubReadyState("loading");

                        // Executes the function.
                        onDomReady(callbackFake);

                        const event = new Event("DOMContentLoaded");
                        document.dispatchEvent(event);

                        // Ensure the `document.addEventListener` method was called once with the
                        // following arguments.
                        Sinon.assert.calledOnceWithExactly(
                            addEventListenerStub,
                            "DOMContentLoaded",
                            Sinon.match.func);

                        // Ensure the callback function was called once.
                        Sinon.assert.calledOnce(callbackFake);
                    });

                test(
                    "document.readyState is \"interactive\"",
                    () =>
                    {
                        stubReadyState("interactive");

                        // Executes the function.
                        onDomReady(callbackFake);

                        // Ensure the `document.addEventListener` method was not called.
                        Sinon.assert.notCalled(addEventListenerStub);

                        // Ensure the callback function was called once.
                        Sinon.assert.calledOnce(callbackFake);
                    });

                test(
                    "document.readyState is \"complete\"",
                    () =>
                    {
                        stubReadyState("complete");

                        // Executes the function.
                        onDomReady(callbackFake);

                        // Ensure the `document.addEventListener` method was not called.
                        Sinon.assert.notCalled(addEventListenerStub);

                        // Ensure the callback function was called once.
                        Sinon.assert.calledOnce(callbackFake);
                    });

                function spyAddEventListener(): AddEventListenerSpy
                {
                    return Sinon.spy(document, "addEventListener");
                }

                function stubReadyState(state: DocumentReadyState): SinonStub
                {
                    return Sinon.stub(document, "readyState").value(state);
                }

                type AddEventListenerSpy = SinonSpy<[string, EventListenerOrEventListenerObject, (boolean | AddEventListenerOptions | undefined)?], void>;
            });
    });

declare global
{
    namespace NodeJS
    {
        interface Global
        {
            Event: typeof Event;
            document: Document;
        }
    }
}
