<div class="mobile-only">
    <h1>Viewport</h1>
    
    <p>These only are visible on mobile.</p>
    <p>Try zooming out massively.</p>
    
    <div class="container">
        <div class="box-1"></div>
        <div class="box-2"></div>
        <div class="box-3"></div>
        <div class="box-4"></div>
    </div>
</div>

<style>
    /* if device has a touch screen */
    @media (any-pointer: coarse) {
        .mobile-only {
            display: block;
        }
    }
    /* if device has no touch screen */
    @media (any-pointer: fine) {
        .mobile-only {
            display: none;
        }
    }

    .container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }
    .box-1 {
        background-color: lightgreen;
        height: 50vh;
    }

    .box-2 {
        background-color: lightblue;
        height: 50svh;
    }

    .box-3 {
        background-color: lightcoral;
        height: 50lvh;
    }

    .box-4 {
        background-color: lightgrey;
        height: 50dvh;
    }

</style>