<?php

/**
 * Template name: Print Invoice
 */

use Timber\Timber;

$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render('@invoice/print.twig', $context);
